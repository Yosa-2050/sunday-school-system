import { Module, OnModuleInit,SetMetadata } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RolesGuard } from "./auth/guards/roles.guard";
import { AppEntities } from "./entities";
import { AppModules } from "./modules";
import { TransformInterceptor } from "./Utilities/interceptor/transform-interceptor";
import { OrganizationModule } from './organization/organization.module';
import { RequestContextService } from "./Utilities/request-context.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: `.env.${process.env.NODE_ENV}`, // Loads the correct .env file
      // isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("POSTGRES_HOST"),
        port: +configService.get<number>("POSTGRES_PORT"),
        username: configService.get("POSTGRES_USER"),
        password: configService.get("POSTGRES_PASSWORD"),
        database: configService.get("POSTGRES_DATABASE"),
        entities: AppEntities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ...AppModules,
    OrganizationModule,
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
  exports:[
    RequestContextService
  ]
})
export class AppModule {}
