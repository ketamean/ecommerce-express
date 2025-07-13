import { Request } from "express";

export interface GraphQLContext {
  req?: Request;
  user?: {
    userId: string;
    username: string;
    isAdmin: boolean;
  };
}
