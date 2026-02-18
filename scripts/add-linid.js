const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

// Load environment from backend
const envPath = path.resolve(__dirname, '../backend/.env');
dotenv.config({ path: envPath });

const mongoose = require('../backend/node_modules/mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'WARRIOR' },
    occupation: String,
    avatarUrl: String,
    joinedAt: { type: Date, default: Date.now }
}, { strict: false });

const User = mongoose.model('User', UserSchema);

async function addLinid() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        const username = 'LINID';
        const rawPassword = 'coordinacion2026';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);

        const existing = await User.findOne({ username });

        if (existing) {
            console.log('User LINID already exists. Updating credentials...');
            existing.fullName = 'Linid';
            existing.occupation = 'COORDINADORA';
            existing.avatarUrl = '/integrantes/Linid.webp';
            existing.password = hashedPassword;
            await existing.save();
            console.log('Updated LINID successfully.');
        } else {
            const newUser = new User({
                username,
                fullName: 'Linid',
                password: hashedPassword,
                role: 'SENSEI', // Consistent with coordinator role
                occupation: 'COORDINADORA',
                avatarUrl: '/integrantes/Linid.webp'
            });
            await newUser.save();
            console.log('Created LINID successfully.');
        }

    } catch (err) {
        console.error('Error adding Linid:', err);
    } finally {
        await mongoose.disconnect();
    }
}

addLinid();
