import * as fs from 'fs';
import * as path from 'path';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/samuraikallpa';

async function seedFIs() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const User = mongoose.model('User', new mongoose.Schema({
        username: String,
        fullName: String
    }));

    const ImpossibleFuture = mongoose.model('ImpossibleFuture', new mongoose.Schema({
        samuraiId: mongoose.Schema.Types.ObjectId,
        title: String,
        description: String,
        progressPercentage: Number,
        status: String,
        createdAt: { type: Date, default: Date.now }
    }));

    // CRITICAL: Clear existing data
    console.log('Clearing existing ImpossibleFuture data...');
    await ImpossibleFuture.deleteMany({});
    console.log('Data cleared.');

    const filePath = path.join(__dirname, '../../../fis.md');
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        await mongoose.disconnect();
        return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const users: any[] = await User.find({});

    let currentUser: any = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect user name between pipes: | Name |
        const userMatch = line.match(/^\|\s*(.*?)\s*\|$/);
        if (userMatch) {
            const nameInFile = userMatch[1].toUpperCase();

            // Try matching by username (nickname) or fullName
            const foundUser = users.find(u => {
                const nick = u.username.toUpperCase();
                const full = u.fullName.toUpperCase();
                return nameInFile === nick || nameInFile === full || full.includes(nameInFile) || nameInFile.includes(nick);
            });

            if (foundUser) {
                currentUser = foundUser;
                console.log(`\n>>> User Identified: ${currentUser.username} (${nameInFile})`);
            } else {
                currentUser = null;
                console.warn(`\n!!! User NOT FOUND for: ${nameInFile}`);
            }
            continue;
        }

        if (currentUser && line.match(/^\d+\s+/)) {
            // It's a numbered FI: "1 Title: Description" or "1 Title"
            const fiTokenMatch = line.match(/^(\d+)\s+(.*?)$/);
            if (fiTokenMatch) {
                const content = fiTokenMatch[2];
                let title = '';
                let description = '';
                let progress = 0;

                if (content.includes(':')) {
                    const parts = content.split(':');
                    title = parts[0].trim();
                    description = parts.slice(1).join(':').trim();
                } else {
                    title = content.trim();
                    description = title;
                }

                // Extract percentage from anywhere in the line
                const pctMatch = line.match(/(\d+)\s*%/);
                if (pctMatch) {
                    progress = parseInt(pctMatch[1]);
                }

                const status = progress === 100 ? 'ACHIEVED' : 'IN_PROGRESS';

                try {
                    await ImpossibleFuture.create({
                        samuraiId: currentUser._id,
                        title: title,
                        description: description || title,
                        progressPercentage: progress,
                        status: status
                    });
                    console.log(`  + [FI ${fiTokenMatch[1]}] Added: ${title.substring(0, 30)}... (${progress}%)`);
                } catch (err) {
                    console.error(`  - Error for ${currentUser.username}:`, err.message);
                }
            }
        } else if (currentUser && (line.startsWith('FI ') || line.startsWith('Fi=') || line.startsWith('F='))) {
            // Fallback for different formats (like at the end of the file)
            let title = line.replace(/^(FI \d+|Fi=|F=)\s*/i, '').trim();
            let progress = 0;
            const pctMatch = line.match(/(\d+)\s*%/);
            if (pctMatch) progress = parseInt(pctMatch[1]);

            const status = progress === 100 ? 'ACHIEVED' : 'IN_PROGRESS';

            try {
                await ImpossibleFuture.create({
                    samuraiId: currentUser._id,
                    title: title,
                    description: title,
                    progressPercentage: progress,
                    status: status
                });
                console.log(`  + [FI Manual] Added: ${title.substring(0, 30)}... (${progress}%)`);
            } catch (err) {
                console.error(`  - Error for ${currentUser.username}:`, err.message);
            }
        }
    }

    console.log('\nFIs Re-seeding complete.');
    await mongoose.disconnect();
}

seedFIs().catch(console.error);
