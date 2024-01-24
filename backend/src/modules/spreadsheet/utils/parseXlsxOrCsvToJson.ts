import * as xlsx from "xlsx";
import * as csv from "csvtojson";
import { File } from "../interfaces/File";
import { Subscriber } from "../interfaces/Subscriber";
import { BadRequestException } from "@nestjs/common";
import { coinToNumberRegex } from "./coinToNumberRegex";

export const parseXlsxOrCsvToJson = async (file: File) => {
  if (file.originalname.includes(".xlsx")) {
    const workBook = xlsx.readFile(file.path, {
      type: 'buffer',
      cellDates: true,
      cellNF: false,
    });
    const sheetName = workBook.SheetNames[0];
    const sheet = workBook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet) as Subscriber[];
  } else if (file.originalname.includes(".csv")) {
    const csvToJson = await csv().fromFile(file.path);
    return csvToJson.map(sub => {
      const subTyped = {
        id: Number(sub.id),
        name: String(sub.name),
        register_date: new Date(sub.register_date),
        plan_type: String(sub.plan_type),
        payment: parseFloat(sub.payment.match(coinToNumberRegex)[0]),
      } as Subscriber;
      if (sub.cancel_date) {
        return {
          ...subTyped,
          cancel_date: new Date(sub.cancel_date),
        }
      }
      return subTyped;
    });
  } else {
    throw new BadRequestException("This file doesn't is xlsx or csv type!");
  }
}
