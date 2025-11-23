// Controlador para gestionar suscripciones de usuarios a materias

import { Response } from "express";
import { RequestExt } from "../interfaces/requestExt.interface";
import { handleHttp } from "../utils/error.handle";
import {
    subscribeToSubject,
    unsubscribeFromSubject,
    getUserSubscriptions,
    getAllSubjectsWithSubscriptionStatus,
} from "../services/subscription";

// Controlador para suscribirse a una materia
const subscribeCtrl = async (req: RequestExt, res: Response) => {
    try {
        const { subjectId } = req.body;
        const userPayload = req.user; // El payload del JWT

        if (!subjectId) {
            return res.status(400).json({ error: "subjectId is required" });
        }

        if (!userPayload || typeof userPayload === "string") {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const userId = userPayload.id; // El email está en el payload

        // Obtener el _id del usuario desde el email
        const UserModel = require("../models/user").default;
        const user = await UserModel.findOne({ email: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const response = await subscribeToSubject(user._id.toString(), subjectId);

        if (response === "SUBJECT_NOT_FOUND") {
            return res.status(404).json({ error: "Subject not found" });
        }

        if (response === "ALREADY_SUBSCRIBED") {
            return res.status(409).json({ error: "Already subscribed to this subject" });
        }

        if (response === "ERROR_SUBSCRIBING") {
            return res.status(500).json({ error: "Error subscribing to subject" });
        }

        res.status(200).json({
            message: "Successfully subscribed to subject",
            data: response,
        });
    } catch (error) {
        handleHttp(res, "ERROR_SUBSCRIBE", error);
    }
};

// Controlador para desuscribirse de una materia
const unsubscribeCtrl = async (req: RequestExt, res: Response) => {
    try {
        const { subjectId } = req.body;
        const userPayload = req.user;

        if (!subjectId) {
            return res.status(400).json({ error: "subjectId is required" });
        }

        if (!userPayload || typeof userPayload === "string") {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const userId = userPayload.id;

        // Obtener el _id del usuario desde el email
        const UserModel = require("../models/user").default;
        const user = await UserModel.findOne({ email: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const response = await unsubscribeFromSubject(user._id.toString(), subjectId);

        if (response === "NOT_SUBSCRIBED") {
            return res.status(409).json({ error: "Not subscribed to this subject" });
        }

        if (response === "ERROR_UNSUBSCRIBING") {
            return res.status(500).json({ error: "Error unsubscribing from subject" });
        }

        res.status(200).json({
            message: "Successfully unsubscribed from subject",
            data: response,
        });
    } catch (error) {
        handleHttp(res, "ERROR_UNSUBSCRIBE", error);
    }
};

// Controlador para obtener las materias suscritas del usuario
const getSubscriptionsCtrl = async (req: RequestExt, res: Response) => {
    try {
        const userPayload = req.user;

        if (!userPayload || typeof userPayload === "string") {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const userId = userPayload.id;

        // Obtener el _id del usuario desde el email
        const UserModel = require("../models/user").default;
        const user = await UserModel.findOne({ email: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const response = await getUserSubscriptions(user._id.toString());

        if (response === "ERROR_GETTING_SUBSCRIPTIONS") {
            return res.status(500).json({ error: "Error getting subscriptions" });
        }

        res.status(200).json({
            message: "Subscriptions retrieved successfully",
            data: response,
        });
    } catch (error) {
        handleHttp(res, "ERROR_GET_SUBSCRIPTIONS", error);
    }
};

// Controlador para obtener todas las materias con estado de suscripción
const getAllWithSubscriptionStatusCtrl = async (req: RequestExt, res: Response) => {
    try {
        const userPayload = req.user;

        if (!userPayload || typeof userPayload === "string") {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const userId = userPayload.id;

        // Obtener el _id del usuario desde el email
        const UserModel = require("../models/user").default;
        const user = await UserModel.findOne({ email: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const response = await getAllSubjectsWithSubscriptionStatus(user._id.toString());

        if (response === "ERROR_GETTING_SUBJECTS") {
            return res.status(500).json({ error: "Error getting subjects" });
        }

        res.status(200).json({
            message: "Subjects retrieved successfully",
            data: response,
        });
    } catch (error) {
        handleHttp(res, "ERROR_GET_ALL_SUBJECTS", error);
    }
};

export {
    subscribeCtrl,
    unsubscribeCtrl,
    getSubscriptionsCtrl,
    getAllWithSubscriptionStatusCtrl,
};
