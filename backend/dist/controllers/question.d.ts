import type { Request, Response } from "express";
export declare const Askquestion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getallquestion: (req: Request, res: Response) => Promise<void>;
export declare const getquestion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deletequestion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const votequestion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=question.d.ts.map