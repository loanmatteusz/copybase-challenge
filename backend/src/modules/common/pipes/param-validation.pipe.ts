import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class ParamValidation implements PipeTransform {

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException(`The query value of ${metadata.data} should not be empty!`);
    }
    return value;
  }

}
