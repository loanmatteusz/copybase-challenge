import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './modules/common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionFilter);

  const corsOptions = {
    origin: '*',
    methods: 'POST',
  };
  app.enableCors(corsOptions);

  const config = new DocumentBuilder()
    .setTitle('Spreadsheet API')
    .setDescription('This is a documentatiion to examplify how you can do upload of an file .xlsx or .csv')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(3000);
}
bootstrap();
