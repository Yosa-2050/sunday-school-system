import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import type { Readable } from 'node:stream';
import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

@Injectable()
export class SeaweedFsS3Service {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;

    constructor(private readonly configService: ConfigService) {
        const endpoint = this.configService.get<string>(
            'SEAWEEDFS_S3_ENDPOINT',
        );
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>(
            'AWS_SECRET_ACCESS_KEY',
        );
        this.bucketName = this.configService.get<string>(
            'AWS_BUCKET_NAME',
            'sourcepin',
        );

        if (!(accessKeyId && secretAccessKey)) {
            throw new InternalServerErrorException(
                'AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be defined',
            );
        }

        this.s3Client = new S3Client({
            region: 'us-east-1',
            endpoint,
            forcePathStyle: true,
            credentials: { accessKeyId, secretAccessKey },
        });
    }

    async uploadFile(
        file: { buffer: Buffer; originalName: string; mimeType: string },
        metaData: Record<string, string> = {},
    ): Promise<{
        fileId: string;
        bucketName: string;
        contentType: string;
        originalName: string;
    }> {
        const fileId = randomUUID() + extname(file.originalName);
        const params = {
            Bucket: this.bucketName,
            Key: fileId,
            Body: file.buffer,
            ContentType: file.mimeType,
            Metadata: metaData,
        };

        await this.s3Client.send(new PutObjectCommand(params));

        return {
            fileId,
            bucketName: this.bucketName,
            contentType: file.mimeType,
            originalName: file.originalName,
        };
    }

    async generatePresignedUploadUrl(
        fileInfo: { originalName: string; contentType?: string },
        expiresIn = 3600,
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
            Bucket: this.bucketName,
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
                bucketName: this.bucketName,
                contentType: fileInfo.contentType,
                originalName: fileInfo.originalName,
            },
        };
    }

    async downloadFile(
        fileInfo: { fileId: string; contentType?: string },
        res: Response,
    ): Promise<void> {
        const params = { Bucket: this.bucketName, Key: fileInfo.fileId };
        const command = new GetObjectCommand(params);
        const response = await this.s3Client.send(command);

        res.setHeader(
            'Content-Type',
            fileInfo.contentType || 'application/octet-stream',
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=${fileInfo.fileId}`,
        );

        // Cast response.Body to a Readable stream
        (response.Body as Readable).pipe(res);
    }

    async generatePresignedDownloadUrl(
        fileInfo: { fileId: string },
        expiresIn = 3600,
    ): Promise<string> {
        const params = { Bucket: this.bucketName, Key: fileInfo.fileId };
        const command = new GetObjectCommand(params);
        return await getSignedUrl(this.s3Client, command, { expiresIn });
    }
}
