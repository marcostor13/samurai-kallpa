import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

@Injectable()
export class S3ProviderSkill {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        const region = this.configService.get<string>('AWS_REGION2') || 'us-east-1';
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID2');
        const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY2');
        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME2')!;

        if (!accessKeyId || !secretAccessKey || !this.bucketName) {
            console.error('S3 Configuration Missing:', {
                hasAccessKey: !!accessKeyId,
                hasSecretKey: !!secretAccessKey,
                hasBucket: !!this.bucketName,
                region
            });
        }

        this.s3Client = new S3Client({
            region,
            credentials: {
                accessKeyId: accessKeyId!,
                secretAccessKey: secretAccessKey!,
            },
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        let fileBuffer = file.buffer;
        let contentType = file.mimetype;
        let fileExtension = file.originalname.split('.').pop()?.toLowerCase();

        // Convert images to WebP
        if (contentType.startsWith('image/')) {
            try {
                fileBuffer = await sharp(file.buffer)
                    .webp({ quality: 80 })
                    .toBuffer();
                contentType = 'image/webp';
                fileExtension = 'webp';
            } catch (error) {
                console.warn('Image conversion failed, uploading original format', error);
            }
        }

        // Ensure filename ends with correct extension
        const originalNameWithoutExt = file.originalname.replace(/\.[^/.]+$/, "");
        const fileKey = `${uuidv4()}-${originalNameWithoutExt}.${fileExtension}`;

        const region = this.configService.get<string>('AWS_REGION2') || 'us-east-1';

        try {
            if (!this.bucketName) throw new Error('Bucket name is not configured');

            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileKey,
                Body: fileBuffer,
                ContentType: contentType,
            });

            await this.s3Client.send(command);

            // Construct the public URL
            return `https://${this.bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
        } catch (error) {
            console.error('S3 Upload Error Details:', {
                message: error.message,
                code: error.code,
                requestId: error.$metadata?.requestId,
                bucket: this.bucketName,
                region: region
            });
            throw new InternalServerErrorException(`Error uploading file to S3: ${error.message}`);
        }
    }
}
