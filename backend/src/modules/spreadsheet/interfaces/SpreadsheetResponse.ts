import { ApiProperty } from "@nestjs/swagger";
import { MrrByMonth } from "./MrrByMonth";

export class SpreadsheetResponse {
  @ApiProperty({ example: 8392 })
  totalMrr: number;

  @ApiProperty({ example: 357 })
  newMrr: number;

  @ApiProperty({ example: 90 })
  churnMrr: number;

  @ApiProperty({ isArray: true, example: [{ month: "2023-01", totalMonthlyMrr: 235 }] })
  mrrByMonth: MrrByMonth[];
}
