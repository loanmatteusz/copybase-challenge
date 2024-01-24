import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponse {
  @ApiProperty({ example: "2024-01-24T04:16:22.321Z" })
  timestamp: string;

  @ApiProperty({ example: "/api/v1/spreadsheet/upload" })
  path: string;

  @ApiProperty({
    example: {
      "message": "The query value of undefined should not be empty!",
      "error": "Bad Request",
      "statusCode": 400
    }
  })
  error: any;
}
