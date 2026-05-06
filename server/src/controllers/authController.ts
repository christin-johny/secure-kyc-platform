import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { IAuthService } from '../domain/services/IAuthService';
import { IUserService } from '../domain/services/IUserService';
import * as ERRORS from '../constants/errors';

@injectable()
export class AuthController {
  constructor(
    @inject('IAuthService') private authService: IAuthService,
    @inject('IUserService') private userService: IUserService
  ) {}

  private setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000   
    });
  }

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const { accessToken, refreshToken } = await this.authService.registerUser(name, email, password);
      
      this.setRefreshCookie(res, refreshToken);
      res.status(201).json({ success: true, accessToken });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: ERRORS.AUTH.MISSING_CREDENTIALS });
      }

      const { accessToken, refreshToken } = await this.authService.loginUser(email, password);
      
      this.setRefreshCookie(res, refreshToken);
      res.status(200).json({ success: true, accessToken });
    } catch (error: any) {
      res.status(401).json({ success: false, error: error.message });
    }
  };

  refresh = async (req: Request, res: Response) => {
    try { 
      const accessToken = this.authService.refreshAccessToken(req.cookies.refreshToken);
      res.status(200).json({ success: true, accessToken });
    } catch (error) {
      res.status(401).json({ success: false, error: ERRORS.AUTH.TOKEN_FAILED });
    }
  };

  getMe = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const userProfile = await this.userService.getUserProfile(userId);

      res.status(200).json({ 
        success: true, 
        data: userProfile
      });
    } catch (error: any) {
      console.error(error);
      if (error.message === 'User not found') {
         return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.status(500).json({ success: false, error: ERRORS.SERVER.INTERNAL_ERROR });
    }
  };

  logout = (req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    res.status(200).json({ success: true, message: 'Logged out' });
  };
}
