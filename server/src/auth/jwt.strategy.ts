import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { UsersService } from "../users/users.service";

const JWT_DEV_SECRET = "plantworld-dev-jwt-secret";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || JWT_DEV_SECRET,
    });
  }

  async validate(payload: { sub: string; role: string; iat: number }) {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException(
        "The user belonging to this token no longer exists",
      );
    }

    if (user.changedPasswordAfter(payload.iat)) {
      throw new UnauthorizedException(
        "User recently changed password. Please login again.",
      );
    }

    return {
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    };
  }
}
