// Librerías externas
import { Response, NextFunction } from "express";

// Módulos locales
import { RequestExt } from "../interfaces/requestExt.interface";
import UserModel from "../models/user";

// Lista de emails de administradores hardcodeados
const ADMIN_EMAILS = [
    "admin@edutrack.com.ar"
];

// Middleware para verificar si el usuario es administrador
const checkIsAdmin = async (req: RequestExt, res: Response, next: NextFunction) => {
    try {
        // Obtener el email del usuario autenticado (viene del middleware checkJwt)
        const userPayload = req.user;

        // Validar que el payload no sea un string
        if (!userPayload || typeof userPayload === "string") {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }

        const userEmail = userPayload.id; // El id es el email según el token JWT

        if (!userEmail) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }

        // Verificar si el email está en la lista de administradores
        const isAdmin = ADMIN_EMAILS.includes(userEmail.toLowerCase());

        if (!isAdmin) {
            return res.status(403).json({ 
                error: "Acceso denegado. Solo administradores pueden realizar esta acción." 
            });
        }

        // Si es admin, continuar
        next();
    } catch (error) {
        res.status(500).json({ error: "Error al verificar permisos de administrador" });
    }
};

export { checkIsAdmin };
