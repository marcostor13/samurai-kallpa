const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const PUBLIC_DIR = path.join(__dirname, '../frontend/public');
const SRC_DIR = path.join(__dirname, '../frontend/src'); // Also check src for imported assets if any

const dirsToProcess = [PUBLIC_DIR];

async function processDirectory(directory) {
    if (!fs.existsSync(directory)) {
        console.log(`Directory not found: ${directory}`);
        return;
    }

    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await processDirectory(filePath);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                const webpPath = filePath.replace(ext, '.webp');
                
                // Skip if webp already exists and is newer
                if (fs.existsSync(webpPath)) {
                    const webpStat = fs.statSync(webpPath);
                    if (webpStat.mtime > stat.mtime) {
                        console.log(`Skipping ${file}, WebP already up to date.`);
                        continue;
                    }
                }

                console.log(`Converting ${file} to WebP...`);
                try {
                    await sharp(filePath)
                        .webp({ quality: 80 })
                        .toFile(webpPath);
                    
                    console.log(`✓ Created ${path.basename(webpPath)}`);
                    
                    // Optional: Delete original? 
                    // For now, let's keep them until we verify everything works.
                    // fs.unlinkSync(filePath); 
                } catch (err) {
                    console.error(`✗ Error converting ${file}:`, err);
                }
            }
        }
    }
}

async function main() {
    console.log('Starting image conversion to WebP...');
    try {
        for (const dir of dirsToProcess) {
            console.log(`Processing directory: ${dir}`);
            await processDirectory(dir);
        }
        console.log('All done!');
    } catch (error) {
        console.error('Fatal error:', error);
    }
}

main();
