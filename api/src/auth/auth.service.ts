import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  wrappedMasterKey: string;
  salt: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<AuthTokens> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    return {
      accessToken,
      refreshToken,
      wrappedMasterKey: user.wrappedMasterKey,
      salt: user.salt,
    };
  }

  async signUp(dto: SignUpDto): Promise<AuthTokens> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      salt: dto.salt,
      wrappedMasterKey: dto.wrappedMasterKey,
      seedPhraseHash: dto.seedPhraseHash,
    });

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    return {
      accessToken,
      refreshToken,
      salt: user.salt,
      wrappedMasterKey: user.wrappedMasterKey,
    };
  }

  async signOut(userId: string): Promise<void> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersService.update(userId, { refreshToken: null });
  }
}
