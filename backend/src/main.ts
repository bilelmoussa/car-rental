import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  const options = new DocumentBuilder()
    .setTitle("APIs for car rental app")
    .setDescription("APIs for car rental app, add cars, user auth, online reservation")
    .setVersion("1.0")
    .addServer("http://localhost:3000/", "Local environment")
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: [],
    deepScanRoutes: true,
  });
  SwaggerModule.setup("api-docs", app, document);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
  )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
