const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment from backend
const envPath = path.resolve(__dirname, '../backend/.env');
dotenv.config({ path: envPath });

// Import dependencies from backend node_modules
const mongoose = require('../backend/node_modules/mongoose');
const { S3Client, GetObjectCommand, PutObjectCommand } = require('../backend/node_modules/@aws-sdk/client-s3');
const sharp = require('../backend/node_modules/sharp');
// const { Upload } = require('../backend/node_modules/@aws-sdk/lib-storage'); // Might need this for streaming uploads if large, but putObject is fine for images

// Configuration
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME2;
const REGION = process.env.AWS_REGION2 || 'us-east-1';
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID2;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY2;

if (!BUCKET_NAME || !ACCESS_KEY || !SECRET_KEY) {
    console.error('Missing AWS Configuration');
    process.exit(1);
}

const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY,
    }
});

// Defined Schemas (Simplified)
const UserSchema = new mongoose.Schema({
    avatarUrl: String,
    fullName: String
}, { strict: false });
const User = mongoose.model('User', UserSchema);

const ImpossibleFutureSchema = new mongoose.Schema({
    evidences: [{
        url: String,
        type: String
    }],
    title: String,
    samuraiId: mongoose.Schema.Types.ObjectId
}, { strict: false });
const ImpossibleFuture = mongoose.model('ImpossibleFuture', ImpossibleFutureSchema);

const TribeResourceSchema = new mongoose.Schema({
    url: String,
    type: String,
    title: String
}, { strict: false });
const TribeResource = mongoose.model('TribeResource', TribeResourceSchema);

// Helper to convert buffer to stream
const streamToBuffer = (stream) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });

async function processUrl(url, context) {
    if (!url) return null;
    
    // Debug log
    // console.log(`Checking ${context}: ${url}`);

    if (url.endsWith('.webp')) {
         console.log(`Skipping ${url} (already webp)`);
         return null;
    }

    if (!url.includes(BUCKET_NAME)) {
         console.log(`Skipping ${url} (bucket mismatch, expected ${BUCKET_NAME})`);
         return null; 
    }
    
    // Check extension
    const ext = url.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
        console.log(`Skipping ${url} (extension ${ext} not supported)`);
        return null;
    }

    try {
        console.log(`Processing ${context}: ${url}`);
        
        // Extract Key from URL
        // Format: https://BUCKET.s3.REGION.amazonaws.com/KEY
        // or https://s3.REGION.amazonaws.com/BUCKET/KEY
        let key = '';
        if (url.includes(`${BUCKET_NAME}.s3`)) {
            key = url.split('.com/')[1];
        } else {
            // Fallback parsing
            const parts = url.split('/');
            const bucketIndex = parts.indexOf(BUCKET_NAME);
            if (bucketIndex !== -1) {
                key = parts.slice(bucketIndex + 1).join('/');
            }
        }
        
        if (!key) {
            console.warn(`Could not parse key from ${url}`);
            return null;
        }

        // 1. Get Object
        const getCommand = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
        const response = await s3Client.send(getCommand);
        const originalBuffer = await streamToBuffer(response.Body);

        // 2. Convert
        const webpBuffer = await sharp(originalBuffer)
            .webp({ quality: 80 })
            .toBuffer();

        // 3. Upload new object
        const newKey = key.replace(/\.[^/.]+$/, ".webp");
        const putCommand = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: newKey,
            Body: webpBuffer,
            ContentType: 'image/webp'
        });
        await s3Client.send(putCommand);

        // 4. Return new URL
        const newUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${newKey}`;
        console.log(`✓ Converted to ${newUrl}`);
        return newUrl;

    } catch (error) {
        console.error(`Error processing ${url}:`, error.message);
        return null;
    }
}

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        // 1. Users
        console.log('--- Migrating Users ---');
        const users = await User.find({ avatarUrl: { $regex: /\.(jpg|jpeg|png)$/i } });
        console.log(`Found ${users.length} users to process.`);
        
        for (const user of users) {
            const newUrl = await processUrl(user.avatarUrl, `User ${user.fullName}`);
            if (newUrl) {
                user.avatarUrl = newUrl;
                await user.save();
                console.log(`Updated user ${user.fullName}`);
            }
        }

        // 2. Impossible Futures
        console.log('--- Migrating Impossible Futures ---');
        // Find docs where ANY element in evidences array matches
        const futures = await ImpossibleFuture.find({ "evidences.url": { $regex: /\.(jpg|jpeg|png)$/i } });
        console.log(`Found ${futures.length} futures to process.`);

        for (const future of futures) {
            let changed = false;
            if (future.evidences) {
                for (const ev of future.evidences) {
                    const newUrl = await processUrl(ev.url, `Future ${future.title} Evidence`);
                    if (newUrl) {
                        ev.url = newUrl;
                        changed = true;
                    }
                }
            }
            if (changed) {
                await future.save(); // Note: mixed types might need markModified if generic, but here schema is defined
                console.log(`Updated future ${future.title}`);
            }
        }

        // 3. Tribe Resources
        console.log('--- Migrating Tribe Resources ---');
        const resources = await TribeResource.find({ url: { $regex: /\.(jpg|jpeg|png)$/i }, type: 'MEDIA' }); // Assuming type MEDIA
        console.log(`Found ${resources.length} resources to process.`);

        for (const res of resources) {
             const newUrl = await processUrl(res.url, `Resource ${res.title}`);
             if (newUrl) {
                 res.url = newUrl;
                 await res.save();
                 console.log(`Updated resource ${res.title}`);
             }
        }

        console.log('Migration Complete.');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
