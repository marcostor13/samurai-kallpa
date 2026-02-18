const path = require('path');
const dotenv = require('dotenv');

// Load environment from backend
const envPath = path.resolve(__dirname, '../backend/.env');
dotenv.config({ path: envPath });

const mongoose = require('../backend/node_modules/mongoose');

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME2;
console.log('BUCKET_NAME:', BUCKET_NAME);

const UserSchema = new mongoose.Schema({
    avatarUrl: String,
    fullName: String
}, { strict: false });
const User = mongoose.model('User', UserSchema);

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({ avatarUrl: { $exists: true, $ne: null } }).limit(5);
        users.forEach(u => {
            console.log(`User: ${u.fullName}, URL: ${u.avatarUrl}`);
            if (u.avatarUrl.includes(BUCKET_NAME)) {
                console.log('  -> Contains bucket name');
            } else {
                console.log('  -> DOES NOT contain bucket name');
            }
        });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

check();
