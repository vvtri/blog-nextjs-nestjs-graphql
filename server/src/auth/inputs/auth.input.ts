import { Field, InputType } from '@nestjs/graphql';
import {
  IsValidEmail,
  IsValidText,
} from '../../common/decorators/custom-validator.decorator';

@InputType()
export class LoginInput {
  @IsValidEmail()
  email: string;

  @IsValidText({ minLength: 6 })
  password: string;
}

@InputType()
export class RegisterInput {
  @IsValidEmail()
  email: string;

  @IsValidText({ minLength: 6 })
  password: string;
}
