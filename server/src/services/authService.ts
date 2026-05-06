import { injectable, inject } from 'tsyringe';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { IAuthService, IAuthTokens } from '../domain/services/IAuthService';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import * as ERRORS from '../constants/errors';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  private generateTokens(id: string): IAuthTokens {
    const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET || '', {
      expiresIn: (process.env.JWT_ACCESS_EXPIRE || '15m') as any
    });
    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || '', {
      expiresIn: (process.env.JWT_REFRESH_EXPIRE || '7d') as any
    });
    return { accessToken, refreshToken };
  }

  async registerUser(name: string, email: string, password: string): Promise<IAuthTokens> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(ERRORS.AUTH.USER_EXISTS);
    }
    const user = await this.userRepository.create({ name, email, password });
    return this.generateTokens(user._id!);
  }

  async loginUser(email: string, password: string): Promise<IAuthTokens> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new Error(ERRORS.AUTH.INVALID_CREDENTIALS);
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error(ERRORS.AUTH.INVALID_CREDENTIALS);
    }
    
    return this.generateTokens(user._id!);
  }

  refreshAccessToken(refreshToken: string): string {
    if (!refreshToken) throw new Error(ERRORS.AUTH.NO_REFRESH);
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || '') as any;
    return jwt.sign({ id: decoded.id }, process.env.JWT_ACCESS_SECRET || '', {
      expiresIn: (process.env.JWT_ACCESS_EXPIRE || '15m') as any
    });
  }
}
