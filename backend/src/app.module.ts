import { Module } from '@nestjs/common';
import { SpreadsheetModule } from './modules/spreadsheet/spreadsheet.module';

@Module({
  imports: [SpreadsheetModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
