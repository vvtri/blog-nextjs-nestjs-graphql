import { JwtPayload } from 'jsonwebtoken';

export type JwtAuthPayload = JwtPayload & {
  userId: number;
} 
