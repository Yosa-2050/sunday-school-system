import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeaweedFsS3Module } from './seaweedfs/seaweedfs-s3.module';
import { TypeOrmConfigService } from './typeorm/typeorm.service';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
        UsersModule,
        SeaweedFsS3Module,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
