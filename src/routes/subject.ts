// Librerías externas
import { Router } from "express";

// Módulos locales
import { addSubject, getSubject, getAllSubjects, deleteSubject, updateSubject } from "../controllers/subject";
import { checkJwt } from "../middleware/session";
import { checkIsAdmin } from "../middleware/isAdmin";

// Rutas para las materias
const router = Router();

// Rutas públicas para todos los usuarios autenticados
// GET /subject/get - Obtener materia por nombre
router.get("/get", checkJwt, getSubject);

// GET /subject/getAll - Obtener todas las materias
router.get("/getAll", checkJwt, getAllSubjects);

// Rutas protegidas SOLO para administradores
// POST /subject/add - Crear nueva materia
router.post("/add", checkJwt, checkIsAdmin, addSubject);

// DELETE /subject/delete - Eliminar materia por nombre
router.delete("/delete", checkJwt, checkIsAdmin, deleteSubject);

// PUT /subject/update/:id - Actualizar materia por ID
router.put("/update/:id", checkJwt, checkIsAdmin, updateSubject);

export { router };