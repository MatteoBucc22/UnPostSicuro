import { Request, Response } from 'express';
export declare const createOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const captureOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPaypalConfig: (req: Request, res: Response) => void;
