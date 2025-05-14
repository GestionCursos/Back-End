import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FirebaseGuard } from './guard/firebase.guard';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const firebaseGuard = app.get(FirebaseGuard);
  app.useGlobalGuards(firebaseGuard);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
