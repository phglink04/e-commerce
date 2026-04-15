import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as crypto from "crypto";

import { MailService } from "../mail/mail.service";
import { UsersService } from "../users/users.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { SignupDto } from "./dto/signup.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private signToken(id: string, role: string): string {
    return this.jwtService.sign({ sub: id, role });
  }

  private buildAuthResponse(user: {
    id: string;
    role: string;
    email: string;
    name: string;
    phoneNumber?: string;
  }) {
    return {
      status: "success",
      token: this.signToken(user.id, user.role),
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
        },
      },
    };
  }

  async signup(dto: SignupDto) {
    const user = await this.usersService.createUser(dto);

    return this.buildAuthResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
    });
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email, true);

    if (!user || !(await user.correctPassword(dto.password))) {
      throw new UnauthorizedException("Incorrect email or password");
    }

    return this.buildAuthResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
    });
  }

  async forgotPassword(dto: ForgotPasswordDto, origin?: string) {
    const user = await this.usersService.findByEmail(dto.email, true);

    if (!user) {
      throw new NotFoundException("There is no user with that email address");
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${origin || process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

    const message = `
      <p>Forgot your password?</p>
      <p>Click the button below to reset it:</p>
      <a href="${resetUrl}" style="padding:10px 20px; color:green; text-decoration:underline; border-radius:5px; font-weight:bold;">Reset Password</a>
      <p>If you did not request this, you can safely ignore this email.</p>
    `;

    await this.mailService.sendEmail({
      email: user.email,
      subject: "Your Password reset Token (valid for 10 min)",
      message,
    });

    return {
      status: "success",
      message: "Token sent to email",
    };
  }

  async resetPassword(token: string, dto: ResetPasswordDto) {
    if (dto.password !== dto.passwordConfirm) {
      throw new BadRequestException("Passwords are not the same");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const tokenOwner =
      await this.usersService.findByPasswordResetToken(hashedToken);

    if (!tokenOwner) {
      throw new BadRequestException("Token is invalid or has expired");
    }

    tokenOwner.password = dto.password;
    tokenOwner.passwordConfirm = dto.passwordConfirm;
    tokenOwner.passwordResetToken = undefined;
    tokenOwner.passwordResetExpires = undefined;

    await tokenOwner.save({ validateBeforeSave: false });

    return this.buildAuthResponse({
      id: tokenOwner.id,
      name: tokenOwner.name,
      email: tokenOwner.email,
      role: tokenOwner.role,
      phoneNumber: tokenOwner.phoneNumber,
    });
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    if (dto.password !== dto.passwordConfirm) {
      throw new BadRequestException("Passwords are not the same");
    }

    const user = await this.usersService.findById(userId, true);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isCorrect = await user.correctPassword(dto.currentPassword);
    if (!isCorrect) {
      throw new UnauthorizedException("Your current password is wrong");
    }

    user.password = dto.password;
    user.passwordConfirm = dto.passwordConfirm;
    await user.save();

    return this.buildAuthResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
    });
  }
}
