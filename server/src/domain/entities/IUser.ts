export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  kycImageKey?: string | null;
  kycVideoKey?: string | null;
  createdAt?: Date;
}
