import 'reflect-metadata';
import { container } from 'tsyringe';
import { MongoUserRepository } from './infrastructure/repositories/MongoUserRepository';
import { AuthService } from './services/authService';
import { UserService } from './services/userService';
import { S3Service } from './services/s3Service';
import { KycService } from './services/kycService';

// Repositories
container.register('IUserRepository', { useClass: MongoUserRepository });

// Services
container.register('IAuthService', { useClass: AuthService });
container.register('IUserService', { useClass: UserService });
container.register('IS3Service', { useClass: S3Service });
container.register('IKycService', { useClass: KycService });

export { container };
