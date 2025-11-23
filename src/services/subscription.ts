// Servicio para gestionar suscripciones de usuarios a materias

import UserModel from "../models/user";
import SubjectModel from "../models/subject";
import { Types } from "mongoose";

// Servicio para suscribirse a una materia
const subscribeToSubject = async (userId: string, subjectId: string) => {
    try {
        // Verificar que la materia existe
        const subject = await SubjectModel.findById(subjectId);
        if (!subject) return "SUBJECT_NOT_FOUND";

        // Buscar el usuario
        const user = await UserModel.findById(userId);
        if (!user) return "USER_NOT_FOUND";

        // Verificar si ya está suscrito
        const isSubscribed = user.subscriptions?.some(
            (sub) => sub.toString() === subjectId
        );
        if (isSubscribed) return "ALREADY_SUBSCRIBED";

        // Agregar la materia a las suscripciones
        user.subscriptions = user.subscriptions || [];
        user.subscriptions.push(new Types.ObjectId(subjectId));
        await user.save();

        return user;
    } catch (error) {
        console.error("Error en subscribeToSubject:", error);
        return "ERROR_SUBSCRIBING";
    }
};

// Servicio para desuscribirse de una materia
const unsubscribeFromSubject = async (userId: string, subjectId: string) => {
    try {
        // Buscar el usuario
        const user = await UserModel.findById(userId);
        if (!user) return "USER_NOT_FOUND";

        // Verificar si está suscrito
        const isSubscribed = user.subscriptions?.some(
            (sub) => sub.toString() === subjectId
        );
        if (!isSubscribed) return "NOT_SUBSCRIBED";

        // Remover la materia de las suscripciones
        user.subscriptions = user.subscriptions?.filter(
            (sub) => sub.toString() !== subjectId
        );
        await user.save();

        return user;
    } catch (error) {
        console.error("Error en unsubscribeFromSubject:", error);
        return "ERROR_UNSUBSCRIBING";
    }
};

// Servicio para obtener las materias suscritas de un usuario
const getUserSubscriptions = async (userId: string) => {
    try {
        const user = await UserModel.findById(userId).populate("subscriptions");
        if (!user) return "USER_NOT_FOUND";

        return user.subscriptions || [];
    } catch (error) {
        console.error("Error en getUserSubscriptions:", error);
        return "ERROR_GETTING_SUBSCRIPTIONS";
    }
};

// Servicio para obtener todas las materias con estado de suscripción
const getAllSubjectsWithSubscriptionStatus = async (userId: string) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) return "USER_NOT_FOUND";

        const allSubjects = await SubjectModel.find();
        
        // Mapear materias con estado de suscripción
        const subjectsWithStatus = allSubjects.map((subject) => {
            const isSubscribed = user.subscriptions?.some(
                (sub) => sub.toString() === subject._id.toString()
            );
            return {
                ...subject.toObject(),
                isSubscribed,
            };
        });

        return subjectsWithStatus;
    } catch (error) {
        console.error("Error en getAllSubjectsWithSubscriptionStatus:", error);
        return "ERROR_GETTING_SUBJECTS";
    }
};

export {
    subscribeToSubject,
    unsubscribeFromSubject,
    getUserSubscriptions,
    getAllSubjectsWithSubscriptionStatus,
};
