import { Request, Response } from 'express';
export declare const userExists: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const completeRegistration: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
