export interface IUser {
  _id: string;
  name: string;
  email: string;
  kycImageUrl?: string | null;
  kycVideoUrl?: string | null;
  createdAt: string;
}

export interface IPaginatedResult<T> {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: T[];
}

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  accessToken?: string;
}
