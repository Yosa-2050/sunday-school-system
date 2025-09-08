import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { SharedModule } from 'shared/shared.module';
import { GlobalExceptionFilter } from './Utilities/ExceptionHandlers/exception.filter';
import { DateService } from './Utilities/date.service';
import { BaseModelSubscriber } from './Utilities/interceptor/base-model-subscriber';
import { TransformInterceptor } from './Utilities/interceptor/transform-interceptor';
import { RequestContextService } from './Utilities/request-context.service';
import { AdminReportModule } from './admin-report/admin-report.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './attendance/attendance.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { JobPortalModule } from './education/qualification.module';
import { AppEntities } from './entities';
import { LmsModule } from './lms/lms.module';
import { AppModules } from './modules';
import { OrganizationModule } from './organization/organization.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ClsModule.forRoot({
            middleware: {
                // automatically mount the
                // ClsMiddleware for all routes
                mount: true,
                // and use the setup method to
                // provide default store values.
                setup: (cls, req) => {
                    cls.set('token', req.headers?.authorization?.split(' ')[1]);
                },
            },
        }),
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
        SharedModule,
        AdminReportModule,
        LmsModule,
        AttendanceModule,
    ],
    controllers: [AppController],
    providers: [
        DateService,
        BaseModelSubscriber,
        RequestContextService,
        AppService,
        Logger,
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
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        },
    ],
    exports: [RequestContextService],
})
export class AppModule {}
