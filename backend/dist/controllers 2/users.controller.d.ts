import { Request, Response } from 'express';
export declare const getUsers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const userExists: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
