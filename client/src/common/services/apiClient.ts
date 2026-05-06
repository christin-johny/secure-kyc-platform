import api from '../utils/api';
import { IPaginatedResult, IUser, IApiResponse } from '../../domain/interfaces';

export class DashboardAPI {
  static async getUsers(page: number, limit: number, search: string): Promise<IPaginatedResult<IUser>> {
    const res = await api.get<IPaginatedResult<IUser>>(`/users?page=${page}&limit=${limit}&search=${search}`);
    return res.data;
  }
}

export class KycAPI {
  static async uploadBiometrics(formData: FormData): Promise<IApiResponse> {
    const res = await api.post<IApiResponse>('/kyc/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
  
  static async getKycStatus(): Promise<IApiResponse<IUser>> {
    const res = await api.get<IApiResponse<IUser>>('/auth/me');
    return res.data;
  }
}
