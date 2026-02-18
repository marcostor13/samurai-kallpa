const path = require('path');
const dotenv = require('dotenv');

// Load environment from backend
const envPath = path.resolve(__dirname, '../backend/.env');
dotenv.config({ path: envPath });

const mongoose = require('../backend/node_modules/mongoose');

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
    title: String
}, { strict: false });
const ImpossibleFuture = mongoose.model('ImpossibleFuture', ImpossibleFutureSchema);

const TribeResourceSchema = new mongoose.Schema({
    url: String,
    type: String,
    title: String
}, { strict: false });
const TribeResource = mongoose.model('TribeResource', TribeResourceSchema);

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        // 1. Users
        console.log('--- Migrating Users (Local Paths) ---');
        const users = await User.find({ avatarUrl: { $regex: /\.(jpg|jpeg|png)$/i } });
        
        for (const user of users) {
            // Check if it's a local path (starts with / or has no protocol)
            if (user.avatarUrl.startsWith('/') || !user.avatarUrl.match(/^https?:\/\//)) {
                 const newUrl = user.avatarUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                 console.log(`Updating User ${user.fullName}: ${user.avatarUrl} -> ${newUrl}`);
                 user.avatarUrl = newUrl;
                 await user.save();
            } else {
                console.log(`Skipping external/S3 User ${user.fullName}: ${user.avatarUrl}`);
            }
        }

        // 2. Impossible Futures
        console.log('--- Migrating Impossible Futures (Local Paths) ---');
        const futures = await ImpossibleFuture.find({ "evidences.url": { $regex: /\.(jpg|jpeg|png)$/i } });

        for (const future of futures) {
            let changed = false;
            if (future.evidences) {
                for (const ev of future.evidences) {
                    if (ev.url && (ev.url.startsWith('/') || !ev.url.match(/^https?:\/\//))) {
                        if (ev.url.match(/\.(jpg|jpeg|png)$/i)) {
                            const newUrl = ev.url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                            console.log(`Updating Future "${future.title}" Evidence: ${ev.url} -> ${newUrl}`);
                            ev.url = newUrl;
                            changed = true;
                        }
                    }
                }
            }
            if (changed) {
                await future.save();
            }
        }

        // 3. Tribe Resources
        console.log('--- Migrating Tribe Resources (Local Paths) ---');
        const resources = await TribeResource.find({ url: { $regex: /\.(jpg|jpeg|png)$/i }, type: 'MEDIA' });

        for (const res of resources) {
             if (res.url && (res.url.startsWith('/') || !res.url.match(/^https?:\/\//))) {
                 const newUrl = res.url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                 console.log(`Updating Resource "${res.title}": ${res.url} -> ${newUrl}`);
                 res.url = newUrl;
                 await res.save();
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
