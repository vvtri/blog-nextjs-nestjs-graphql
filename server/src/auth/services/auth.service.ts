import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { Transactional } from 'typeorm-transactional';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthPayload } from '../types/jwt-payload.type';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../common/configs/app.config';
import { AuthTokenModel } from '../models/auth.model';
import { RegisterInput, LoginInput } from '../inputs/auth.input';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<AppConfig>,

    private userRepo: UserRepository,
  ) {}

  @Transactional()
  async register(dto: RegisterInput) {
    const { email, password } = dto;

    let user = await this.userRepo.findOneBy({ email });

    if (user) throw new ConflictException('user conflict');

    const encryptPwd = await bcrypt.hash(password, 12);
    user = this.userRepo.create({ email, password: encryptPwd });
    await this.userRepo.insert(user);

    return this.genAuthTokenRes(user.id);
  }

  @Transactional()
  async login(dto: LoginInput) {
    const { email, password } = dto;

    const user = await this.userRepo.findOneByOrThrowNotFoundExc({ email });

    const isPwMatch = await bcrypt.compare(password, user.password);

    if (!isPwMatch) throw new Error('password not match');

    return this.genAuthTokenRes(user.id);
  }

  private genAuthTokenRes(userId: number): AuthTokenModel {
    const accessToken = this.genAccessToken({ userId });
    const refreshToken = this.genRefreshToken({ userId });

    return AuthTokenModel.forAll({ accessToken, refreshToken });
  }

  private genAccessToken(payload: JwtAuthPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('auth.accessToken.expiresTime'),
      secret: this.configService.get('auth.accessToken.secret'),
      algorithm: this.configService.get('auth.accessToken.algorithm'),
    });
  }

  private genRefreshToken(payload: JwtAuthPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('auth.refreshToken.expiresTime'),
      secret: this.configService.get('auth.refreshToken.secret'),
      algorithm: this.configService.get('auth.refreshToken.algorithm'),
    });
  }
}
