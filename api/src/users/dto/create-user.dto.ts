export class CreateUserDto {
  email: string;
  password: string;
  wrappedMasterKey: string;
  seedPhraseHash: string;
}
