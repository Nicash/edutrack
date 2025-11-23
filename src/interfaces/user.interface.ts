// Módulos locales
import { Auth } from "./auth.interface";
import { Types } from "mongoose";

export interface User extends Auth {
    name: string;
    description: string;
    role?: "admin" | "user";
    subscriptions?: Types.ObjectId[];
}