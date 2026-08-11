export interface User {
  id?: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
  verificationToken?: string;
  verificationTokenExpires?: string;
  isVerified: boolean;
}
