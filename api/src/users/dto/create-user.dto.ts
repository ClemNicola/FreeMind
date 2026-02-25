export class CreateUserDto {
  email: string;
  password: string;
  salt: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  resetToken?: string;
  resetTokenExpires?: Date;
  seedPhraseHash: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
