import { NextFunction, Request, Response } from "express";

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("error");
  if (res.statusCode === 200)
    res.status(500)
  res.send({ errors: [{ message: err.message }] });
};