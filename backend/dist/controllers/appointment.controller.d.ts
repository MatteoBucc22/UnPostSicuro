import { Request, Response } from 'express';
export declare const getAppointmentsBySpecialist: (req: Request, res: Response) => Promise<void>;
export declare const createPendingAppointment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const confirmAppointment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const cancelAppointment: (req: Request, res: Response) => Promise<void>;
export declare const getPendingAppointment: (req: Request, res: Response) => Promise<void>;
export declare const getAppointmentsByUser: (req: Request, res: Response) => Promise<void>;
export declare const updateAppointment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
