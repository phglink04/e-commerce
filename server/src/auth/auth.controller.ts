import {
  Body,
  Controller,
  Headers,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { SignupDto } from "./dto/signup.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Controller("users")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("forgetPassword")
  forgetPassword(
    @Body() dto: ForgotPasswordDto,
    @Headers("origin") origin?: string,
  ) {
    return this.authService.forgotPassword(dto, origin);
  }

  @Patch("resetPassword/:token")
  resetPassword(@Param("token") token: string, @Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(token, dto);
  }

  @Patch("updateMyPassword")
  @UseGuards(JwtAuthGuard)
  updateMyPassword(
    @Req() req: { user: { userId: string } },
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(req.user.userId, dto);
  }
}
