import { Field, InputType } from '@nestjs/graphql';
import { FileUpload } from '../../file/types/file.type';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { IsValidText } from '../../common/decorators/custom-validator.decorator';

@InputType()
export class UpdateUserInput {
  @Field(() => GraphQLUpload)
  avatar?: Promise<FileUpload>;

  @IsValidText({ required: false })
  name?: string;
}
