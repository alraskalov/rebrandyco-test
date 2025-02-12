export interface JwtPayload {
  email: string;
  sub: number; // userId
  role: string;
}
