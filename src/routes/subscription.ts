// Rutas para gestionar suscripciones de usuarios a materias

import { Router } from "express";
import {
    subscribeCtrl,
    unsubscribeCtrl,
    getSubscriptionsCtrl,
    getAllWithSubscriptionStatusCtrl,
} from "../controllers/subscription";
import { checkJwt } from "../middleware/session";

const router = Router();

// POST /subscription/subscribe - Suscribirse a una materia
router.post("/subscribe", checkJwt, subscribeCtrl);

// POST /subscription/unsubscribe - Desuscribirse de una materia
router.post("/unsubscribe", checkJwt, unsubscribeCtrl);

// GET /subscription/my-subscriptions - Obtener materias suscritas del usuario
router.get("/my-subscriptions", checkJwt, getSubscriptionsCtrl);

// GET /subscription/all-with-status - Obtener todas las materias con estado de suscripción
router.get("/all-with-status", checkJwt, getAllWithSubscriptionStatusCtrl);

export { router };
