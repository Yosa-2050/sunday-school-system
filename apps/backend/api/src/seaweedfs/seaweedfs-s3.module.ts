import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SeaweedFsS3Service } from './seaweedfs-s3.service';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [SeaweedFsS3Service],
    exports: [SeaweedFsS3Service],
})
export class SeaweedFsS3Module {}
