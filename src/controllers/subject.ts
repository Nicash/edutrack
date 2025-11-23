// Definimos los controladores para las materias

// Librerías externas
import { Request, Response } from "express";

// Módulos locales
import { createSubject, obtainAllSubjects, obtainSubject, removeSubject, modifySubject } from "../services/subject";
import { handleHttp } from "../utils/error.handle";
import { RequestExt } from "../interfaces/requestExt.interface";
import UserModel from "../models/user";

// Controlador para agregar materias
export const addSubject = async (req: Request, res: Response) => {
  try {
    const { name, objective, content } = req.body;
    
    // Validación de campos requeridos
    if (!name || !objective || !content) {
      return res.status(400).json({ error: "Name, objective and content are required" });
    }
    
    // Validar que no exista una materia con el mismo nombre
    const existing = await obtainSubject(name);
    if (existing) {
      return res.status(409).json({ error: "Subject with this name already exists" });
    }

    const subject = await createSubject(req.body);
    res.status(201).json(subject);
  } catch (error) {
    handleHttp(res, "ERROR_ADD_SUBJECT");
  }
};

// Controlador para obtener materia
export const getSubject = async (req: Request, res: Response) => {
  try {
    const {name} = req.query;
    
    // Validación de parámetro requerido
    if (!name) {
      return res.status(400).json({ error: "Subject name is required" });
    }
    
    const subject = await obtainSubject(name as string);
    
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    
    res.status(200).json(subject);
  } catch (error) {
    handleHttp(res, 'ERROR_GET_ITEM');
  }
};

// Controlador para obtener todas las materias
export const getAllSubjects = async (req: RequestExt, res: Response) => {
  try {
    const { subscribed } = req.query; // Nuevo parámetro opcional para filtrar
    const userPayload = req.user; // Payload del JWT

    // Si el usuario quiere solo sus materias suscritas
    if (subscribed === "true" && userPayload && typeof userPayload !== "string") {
      const userId = userPayload.id; // El email
      const user = await UserModel.findOne({ email: userId }).populate("subscriptions");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({
        message: "Subscribed subjects retrieved successfully",
        data: user.subscriptions || [],
      });
    }

    // Si no, devolver todas las materias
    const subjects = await obtainAllSubjects();
    res.status(200).json(subjects);
  } catch (error) {
    handleHttp(res, 'ERROR_GET_ITEMS'); 
  }
};

// Controlador para eliminar materia
export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const {name} = req.query;
    const deletedSubject = await removeSubject(name as string);

    if (!deletedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({
    message: 'Subject deleted successfully',
    deletedSubject: deletedSubject
    });
  } catch (error) {
    handleHttp(res, 'ERROR_GET_ITEM');
  }
};

// Controlador para modificar materia
export const updateSubject = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const subject = await modifySubject(id, updateData);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.status(200).json(subject);
  } catch (error) {
    handleHttp(res, 'ERROR_GET_ITEM');
  }
};