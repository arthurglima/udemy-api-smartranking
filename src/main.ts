import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  Date.prototype.toJSON = function(): any {
    const timeZone = 'America/Sao_Paulo';
    const zonedDate = toZonedTime(this, timeZone);
    return format(zonedDate, 'yyyy-MM-dd HH:mm:ss.SSS');
  }

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
