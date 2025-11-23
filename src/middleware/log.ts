// Librerías externas
import { NextFunction, Request, Response } from "express";

const LogMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers; // Obtiene los encabezados de la petición
    const userAgent = header["user-agent"]; // Extrae el encabezado user-agent (tipo de usuario)
    next();
};

export { LogMiddleware };