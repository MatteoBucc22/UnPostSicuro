import { Request, Response } from 'express';
export declare const getEbooks: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addEbook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getEbookById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
