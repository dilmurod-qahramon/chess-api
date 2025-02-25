import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterUserDto {
  @MinLength(5, { message: "Minimum required length is 5 characters" })
  @MaxLength(20, { message: "Maximum required length is 20 characters" })
  @IsString()
  username: string;

  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsStrongPassword({}, { message: "Password is too weak!" })
  password: string;
}
