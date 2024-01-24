import * as xlsx from "xlsx";
import * as csv from "csvtojson";
import { File } from "../interfaces/File";
import { FileTitles, Subscriber } from "../interfaces/Subscriber";
import { BadRequestException } from "@nestjs/common";
import { mapData } from "./mapData";

export const parseXlsxOrCsvToJson = async (file: File) => {
  if (file.originalname.includes(".xlsx")) {
    const workBook = xlsx.readFile(file.path, {
      type: 'buffer',
      cellDates: true,
      cellNF: false,
    });
    const sheetName = workBook.SheetNames[0];
    const sheet = workBook.Sheets[sheetName];
    const sheetToJson = xlsx.utils.sheet_to_json(sheet) as FileTitles[];
    return mapData(sheetToJson) as Subscriber[];
  } else if (file.originalname.includes(".csv")) {
    const csvToJson = await csv().fromFile(file.path);
    return mapData(csvToJson);
  } else {
    throw new BadRequestException("This file doesn't is xlsx or csv type!");
  }
}
