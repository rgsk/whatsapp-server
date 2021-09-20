import { Request, Response } from 'express';
export interface MyContext {
  req: Request;
  res: Response;
  payload?: JWTPayload;
}
export interface JWTPayload {
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
