import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    res.cookie('token', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      success: true,
      data: {
        user: result.user,
      },
    };
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  profile(
    @Req()
    req: {
      user: {
        id: number;
        email: string;
        password: string;
      };
    },
  ) {
    return req.user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');

    return {
      success: true,
      message: 'Logout success',
    };
  }
}
