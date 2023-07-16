import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ParsedQs } from 'qs';
import { AppConfig } from '../../common/configs/app.config';
import { StrategyName } from '../../common/constants/auth.constant';
import { UserRepository } from '../repositories/user.repository';
import { JwtAuthPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtAuthenUserStrategy extends PassportStrategy(
  Strategy,
  StrategyName.JWT_AUTHEN_USER,
) {
  constructor(
    configService: ConfigService<AppConfig>,

    private userRepo: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('auth.accessToken.secret'),
      algorithms: [configService.get('auth.accessToken.algorithm')],
    });
  }

  async validate(payload: JwtAuthPayload) {
    const { userId } = payload;
    const user = await this.userRepo.findOneByOrThrowNotFoundExc({
      id: userId,
    });

    return user;
  }
}
