import * as fs from 'fs';
import * as path from 'path';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load .env from backend folder
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/samuraikallpa';

async function seed() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const userSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        email: { type: String, unique: true, sparse: true },
        password: { type: String, required: true },
        fullName: { type: String, required: true },
        role: { type: String, default: 'WARRIOR' },
        bio: String,
        avatarUrl: String,
        joinedAt: { type: Date, default: Date.now },
        phone: String,
        birthDate: String,
        address: String,
        occupation: String,
        quantumLeap: String,
        imo: String,
    });

    const User = mongoose.model('User', userSchema);

    // Permanent exclusion
    const usersToExclude = ['ALFREDO', 'ANTHONY', 'ARTURO', 'RAYZA', 'MAGGIE'];
    console.log('Removing excluded users from DB...');
    await User.deleteMany({ username: { $in: usersToExclude } });

    // Path to info_participantes.md relative to this script
    const filePath = path.join(__dirname, '../../../info_participantes.md');
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        await mongoose.disconnect();
        return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Split by numbered items like "01. ", "02. ", etc.
    const blocks = content.split(/\n(?=\d{2}\. )/);

    for (const block of blocks) {
        const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 2) continue;

        const firstLine = lines[0];
        // Handle "01. Alfredo Samuel Castañeda Solari (ALFREDO)"
        const nameMatch = firstLine.match(/\d{2}\.\s+(.*?)\s*\((.*?)\)/);
        if (!nameMatch) continue;

        const fullName = nameMatch[1].trim();
        const nickname = nameMatch[2].trim();
        const capitalizedNickname = nickname.charAt(0).toUpperCase() + nickname.slice(1).toLowerCase();

        // Permanent exclusion
        const usersToExclude = ['ALFREDO', 'ANTHONY', 'ARTURO', 'RAYZA', 'MAGGIE'];
        if (usersToExclude.includes(nickname)) {
            console.log(`Skipping excluded user: ${nickname}`);
            continue;
        }

        // Mapping for nicknames that don't match the image filename directly
        const nicknameToIconMap: { [key: string]: string } = {
            'ARI': 'Ariana.jpg',
            'ELI': 'Elizabeth.jpg',
            'GIOVI': 'Giovana.jpg',
            'GISSE': 'Gissella.jpg',
            'JESSI': 'Jessica.jpg',
            'NAYE': 'Nayelly.jpg',
            'ROUS': 'Rosmery.jpg',
            'RUTI': 'Ruth.jpg',
        };

        const imageFilename = nicknameToIconMap[nickname] || `${capitalizedNickname}.jpg`;

        const dniLine = lines.find(l => l.startsWith('DNI:'));
        const telLine = lines.find(l => l.startsWith('Teléfono:'));
        const birthLine = lines.find(l => l.startsWith('Fecha de Nacimiento:'));
        const emailLine = lines.find(l => l.startsWith('Correo:'));
        const addrLine = lines.find(l => l.startsWith('Dirección:'));
        const contractLine = lines.find(l => l.startsWith('Contrato:'));
        const occLine = lines.find(l => l.startsWith('Ocupación:'));
        const quantumLine = lines.find(l => l.startsWith('Salto Cuántico:'));
        const imoLine = lines.find(l => l.startsWith('IMO:'));

        if (!dniLine) continue;

        const dni = dniLine.split(':')[1].trim();
        const phone = telLine ? telLine.split(':')[1].trim() : '';
        const birthDate = birthLine ? birthLine.split(':')[1].trim() : '';
        const email = emailLine ? emailLine.split(':')[1].trim() : '';
        const address = addrLine ? addrLine.split(':')[1].trim() : '';
        const bio = contractLine ? contractLine.split(':')[1].trim().replace(/"/g, '') : '';
        const occupation = occLine ? occLine.split(':')[1].trim() : '';
        const quantumLeap = quantumLine ? quantumLine.split(':')[1].trim() : '';
        const imo = imoLine ? imoLine.split(':')[1].trim() : '';

        // Password is the DNI
        const hashedPassword = await bcrypt.hash(dni, 10);

        try {
            await User.findOneAndUpdate(
                { username: nickname },
                {
                    username: nickname,
                    fullName,
                    email: email || undefined,
                    password: hashedPassword,
                    bio,
                    role: 'WARRIOR', // Default role for all
                    avatarUrl: `/integrantes/${imageFilename}`,
                    phone,
                    birthDate,
                    address,
                    occupation,
                    quantumLeap,
                    imo,
                },
                { upsert: true, new: true }
            );
            console.log(`User ${nickname} (${fullName}) seeded.`);
        } catch (err) {
            console.error(`Error seeding ${nickname}:`, err.message);
        }
    }

    console.log('Seeding complete.');
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error('Seed script failed:', err);
    process.exit(1);
});
