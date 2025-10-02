import { Request, Response } from 'express';
export declare const getCart: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const removeItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSpecialist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
