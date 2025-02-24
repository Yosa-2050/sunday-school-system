import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { UsersService } from "./users/users.service";
import { CreateUserDto } from "./users/dto/create-user.dto";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle("Meklit job portal")
    .setDescription("Meklit job portal")
    .setVersion("1.0")
    .addTag("Meklit")
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
  SwaggerModule.setup("api", app, document);

  const userService = app.get(UsersService);

  const seedUser = new CreateUserDto();
  seedUser.email = "admin@admin.com";
  seedUser.password = "password";

  try {
    await userService.createMainAdministrator(seedUser);
  } catch {}

  const port = process.env.PORT || 5000;

  app.listen(port, process.env.IP);
}
bootstrap();
