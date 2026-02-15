import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3ProviderSkill {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.get<string>('AWS_REGION') || 'us-east-1',
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID2')!,
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY2')!,
            },
        });
        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME2')!;
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const fileKey = `${uuidv4()}-${file.originalname}`;

        try {
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            });

            await this.s3Client.send(command);

            // Construct the public URL (assuming public-read or using a constructible pattern)
            // For us-east-1 and standard buckets: https://bucket.s3.amazonaws.com/key
            return `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION2')}.amazonaws.com/${fileKey}`;
        } catch (error) {
            console.error('S3 Upload Error:', error);
            throw new InternalServerErrorException('Error uploading file to S3');
        }
    }
}
