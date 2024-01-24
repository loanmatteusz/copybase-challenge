import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SpreadsheetModule } from './modules/spreadsheet/spreadsheet.module';
import * as cors from 'cors';

@Module({
  imports: [SpreadsheetModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    const corsOptions = {
      origin: 'http://localhost:5173',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    };
    consumer.apply(cors(corsOptions)).forRoutes('*');
  }
}
