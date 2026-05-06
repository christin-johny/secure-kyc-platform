import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { IUserService } from '../domain/services/IUserService';

@injectable()
export class UserController {
  constructor(
    @inject('IUserService') private userService: IUserService
  ) {}

  getUsers = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 5; 
      const search = (req.query.search as string) || '';

      const paginationData = await this.userService.getUsersPaginated(page, limit, search);
      
      res.status(200).json({ success: true, ...paginationData });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}