import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterUserDto {
  @MinLength(5, { message: "Minimum required length is 5 characters" })
  @MaxLength(20, { message: "Maximum required length is 20 characters" })
  @IsNotEmpty({ message: "Username cannot be empty" })
  username: string;

  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @Length(5, 50)
  @IsNotEmpty({ message: "Password cannot be empty" })
  password: string;
}
