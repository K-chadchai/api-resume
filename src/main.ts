import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

const log = new Logger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable JWT
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  // Enable Cors
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000, '0.0.0.0', (_, address) => log.log(`> API is running ... ` + address));
}
bootstrap();
