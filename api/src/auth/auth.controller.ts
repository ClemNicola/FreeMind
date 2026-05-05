import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import * as express from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

const ACCESS_MAX_AGE = 1000 * 60 * 60;
const REFRESH_MAX_AGE = 1000 * 60 * 60 * 24 * 7;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiResponse({ status: HttpStatus.OK, description: 'Sign in successful' })
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, refreshToken, wrappedMasterKey, salt } =
      await this.authService.signIn(dto.email, dto.password);

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_MAX_AGE,
    });
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_MAX_AGE,
      path: '/auth',
    });

    return { wrappedMasterKey, salt };
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sign up successful',
  })
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, refreshToken, wrappedMasterKey, salt } =
      await this.authService.signUp(dto);

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_MAX_AGE,
    });
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_MAX_AGE,
      path: '/auth',
    });

    return { wrappedMasterKey, salt };
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signout')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Sign out successful',
  })
  async signOut(
    @Req() req: express.Request & { user: { sub: string } },
    @Res({ passthrough: true }) res: express.Response,
  ) {
    await this.authService.signOut(req.user.sub);
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', { ...cookieOptions, path: '/auth' });
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  @ApiResponse({ status: HttpStatus.OK, description: 'Current user info' })
  me(@Req() req: express.Request & { user: { sub: string } }) {
    return this.authService.verifyUser(req.user.sub);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiResponse({ status: HttpStatus.OK, description: 'Token refreshed' })
  async refresh(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No refresh token' });
      return;
    }

    try {
      const accessToken = await this.authService.refreshAccessToken(token);

      res.cookie('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: ACCESS_MAX_AGE,
      });

      return { success: true };
    } catch {
      res.clearCookie('accessToken', cookieOptions);
      res.clearCookie('refreshToken', { ...cookieOptions, path: '/auth' });
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid refresh token' });
    }
  }
}
