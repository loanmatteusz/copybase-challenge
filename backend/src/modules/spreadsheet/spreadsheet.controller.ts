import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SpreadsheetService } from './spreadsheet.service';
import { ParamValidation } from '../common/pipes/param-validation.pipe';
import { FileUploadDto } from './dtos/FileUpload.dto';
import { SpreadsheetResponse } from './interfaces/SpreadsheetResponse';
import { ErrorResponse } from '../common/filters/interfaces/error-response.interface';
import { File } from './interfaces/File';

@ApiTags("Spreadsheet")
@Controller('api/v1/spreadsheet')
export class SpreadsheetController {
  constructor(
    private readonly spreadsheetService: SpreadsheetService
  ) { }


  @Post("/upload")
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Choose an xlsx or csv file...', type: FileUploadDto })
  @ApiResponse({ status: 200, description: "OK", type: SpreadsheetResponse })
  @ApiResponse({ status: 400, description: "BadRequest", type: ErrorResponse })
  async uploadAndSpreadSheet(
    @UploadedFile(ParamValidation) file: File,
  ): Promise<SpreadsheetResponse> {
    if (!file) {
      throw new BadRequestException("You need choose any file to proccess");
    }
    return this.spreadsheetService.processSheet(file);
  }
}
