import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Express } from 'express';
import { IDocumentService } from '../document-service.interface';

export class SeaweedFsService implements IDocumentService {
    SEAWEEDFS_S3_ENDPOINT: string = process.env.SEAWEEDFS_S3_ENDPOINT ?? '';
    AWS_ACCESS_KEY_ID: string = process.env.AWS_ACCESS_KEY_ID ?? '';
    AWS_SECRET_ACCESS_KEY: string = process.env.AWS_SECRET_ACCESS_KEY ?? '';
    AWS_BUCKET_NAME: string = process.env.AWS_BUCKET_NAME ?? '';
    s3Client: S3Client;

    constructor() {
        // Initialize the S3 client for SeaweedFS
        if (!(this.AWS_ACCESS_KEY_ID && this.AWS_SECRET_ACCESS_KEY)) {
            throw new Error(
                'AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be defined',
            );
        }

        this.s3Client = new S3Client({
            region: 'us-east-1', // SeaweedFS does not enforce region
            endpoint: this.SEAWEEDFS_S3_ENDPOINT,
            forcePathStyle: true, // Required for SeaweedFS compatibility
            credentials: {
                accessKeyId: this.AWS_ACCESS_KEY_ID as string,
                secretAccessKey: this.AWS_SECRET_ACCESS_KEY as string,
            },
        });
    }

    /**
     * Upload a file to SeaweedFS S3
     */
    async upload(file: Express.Multer.File): Promise<string> {
        const fileId = randomUUID() + extname(file.originalname);
        const params = {
            Bucket: this.AWS_BUCKET_NAME,
            Key: fileId,
            Body: file.buffer,
            ContentType: file.mimetype,
            //Metadata: metaData,
        };

        await this.s3Client.send(new PutObjectCommand(params));

        return fileId;
    }

    /**
     * Generate a pre-signed URL for uploading a file to SeaweedFS S3
     */
    async generatePresignedUploadUrl(
        fileInfo: { originalName: string; contentType?: string },
        bucketName: string = this.AWS_BUCKET_NAME || 'sourcepin',
        expiresIn = 3600, // URL expires in 1 hour
    ): Promise<{
        presignedUrl: string;
        file: {
            fileId: string;
            bucketName: string;
            contentType?: string;
            originalName: string;
        };
    }> {
        const fileId = randomUUID() + extname(fileInfo.originalName);
        const params = {
            Bucket: bucketName,
            Key: fileId,
            ContentType: fileInfo.contentType,
        };

        const command = new PutObjectCommand(params);
        const presignedUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn,
        });

        return {
            presignedUrl,
            file: {
                fileId,
                bucketName,
                contentType: fileInfo.contentType,
                originalName: fileInfo.originalName,
            },
        };
    }

    /**
     * Download a file from SeaweedFS S3
     */
    async download(fileId: string): Promise<Uint8Array> {
        const params = {
            Bucket: this.AWS_BUCKET_NAME,
            Key: fileId,
        };

        const command = new GetObjectCommand(params);
        const response = await this.s3Client.send(command);

        return response.Body.transformToByteArray();
    }
    /**
     * Generate a pre-signed URL for downloading a file from SeaweedFS S3
     */
    async generatePresignedDownloadUrl(
        fileInfo: { fileId: string },
        expiresIn = 3600,
    ): Promise<string> {
        const params = {
            Bucket: this.AWS_BUCKET_NAME,
            Key: fileInfo.fileId,
        };

        const command = new GetObjectCommand(params);
        const presignedUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn,
        });
        return presignedUrl;
    }
}
