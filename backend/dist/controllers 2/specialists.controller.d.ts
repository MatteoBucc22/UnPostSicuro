import { Request, Response } from 'express';
export declare const getSpecialists: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addSpecialist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSpecialist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
