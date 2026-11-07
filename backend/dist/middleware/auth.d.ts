import type { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            userid: string;
        }
    }
}
declare const auth: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default auth;
//# sourceMappingURL=auth.d.ts.map