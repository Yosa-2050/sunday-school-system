import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransformInterceptor } from './Utilities/interceptor/transform-interceptor';
import { RequestContextService } from './Utilities/request-context.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { AppEntities } from './entities';
import { JobPortalModule } from './job_portal/job_portal.module';
import { AppModules } from './modules';
import { OrganizationModule } from './organization/organization.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            // envFilePath: `.env.${process.env.NODE_ENV}`, // Loads the correct .env file
            // isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('POSTGRES_HOST'),
                port: +configService.get<number>('POSTGRES_PORT'),
                username: configService.get('POSTGRES_USER'),
                password: configService.get('POSTGRES_PASSWORD'),
                database: configService.get('POSTGRES_DATABASE'),
                entities: AppEntities,
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        ...AppModules,
        OrganizationModule,
        JobPortalModule,
    ],
    controllers: [AppController],
    providers: [
        RequestContextService,
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        AppService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
        // {
        //   provide: APP_FILTER,
        //   useClass: QueryFailedFilter,
        // },
    ],
    exports: [RequestContextService],
})
export class AppModule {}
