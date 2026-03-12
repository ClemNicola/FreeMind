import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './aut.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto.email, dto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto.email, dto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(
    @Request() req: Request & { user: { sub: string; email: string } },
  ) {
    return req.user;
  }
}
