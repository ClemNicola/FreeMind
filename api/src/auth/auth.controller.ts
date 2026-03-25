import {
  Controller,
  Post,
  Body,
  Request,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiResponse({ status: HttpStatus.OK, description: 'Sign in successful' })
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto.email, dto.password);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sign up successful',
  })
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signout')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Sign out successful',
  })
  signOut(@Request() req: Request & { user: { sub: string; email: string } }) {
    return this.authService.signOut(req.user.sub);
  }
}
