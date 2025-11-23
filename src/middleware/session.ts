// Librerías externas
import { NextFunction, Request, Response } from "express";

// Módulos locales
import { verifyToken } from "../utils/jwt.handle";
import { RequestExt } from "../interfaces/requestExt.interface";

// Middleware para verificar JWT en las peticiones autenticadas
const checkJwt = (req: RequestExt, res: Response, next: NextFunction) => {
    try {
        // Obtener token del header de la autorización
        const jwtByUser = req.headers.authorization || "";

        // Nos quedamos con el payload
        const jwt = jwtByUser.split(" ").pop();

        // Verifica si el token es válido
        const isUser = verifyToken(`${jwt}`);

        // Si el usuario no es válido devuelve 401 (no autorizado)
        if (!isUser) {
            return res.status(401).json({ error: "Token JWT inválido" });
        } else {
            req.user = isUser; // Si es válido, guarda la info del usuario
            next();
        }

    } catch (e) {
        // Manejo de errores
        res.status(400).json({ error: "Sesión no válida" });
    }
};

export { checkJwt };