import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FirebaseGuard } from './guard/firebase.guard';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const firebaseGuard = app.get(FirebaseGuard);
//  app.useGlobalGuards(firebaseGuard);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
