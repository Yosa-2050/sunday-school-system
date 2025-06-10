import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';
import { LookupSeederService } from './Utilities/service/lookup-seeder.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );
    app.enableCors();
    const config = new DocumentBuilder()
        .setTitle('Meklit job portal')
        .setDescription('Meklit job portal')
        .setVersion('1.0')
        .addTag('Meklit')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT', // optional, just for UI display
            },
            'access-token',
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    document.components.securitySchemes = {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
    };
    document.security = [{ bearerAuth: [] }];
    SwaggerModule.setup('api', app, document);

    const userService = app.get(UsersService);
    const seeder = app.get(LookupSeederService);

    const seedUser = new CreateUserDto();
    seedUser.email = process.env.default_user || 'heraniadmin@yopmail.com';
    seedUser.password = process.env.default_password || 'P@ssw0rd';

    try {
        await seeder.seedFromCsvIfNeeded();

        await userService.createMainAdministrator(seedUser);
    } catch (ex){
        //TODO: write logs
        console.log(ex)
    }

    const port = process.env.PORT || 5000;

    app.listen(port, process.env.IP);
}
bootstrap();
