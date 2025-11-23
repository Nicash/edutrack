// Script para crear usuario administrador inicial
// Ejecutar UNA SOLA VEZ: ts-node src/scripts/createAdmin.ts

import dbConnect from "../config/mongo";
import UserModel from "../models/user";
import { encrypt } from "../utils/bcrypt.handle";

const createAdmin = async () => {
    try {
        // Conectar a la base de datos
        await dbConnect();
        console.log("📦 Conectado a MongoDB");

        const adminEmail = "admin@edutrack.com.ar";
        const adminPassword = "admin_edutrack";

        // Verificar si el admin ya existe
        const adminExists = await UserModel.findOne({ email: adminEmail });
        if (adminExists) {
            console.log("❌ El usuario administrador ya existe");
            process.exit(0);
        }

        // Encriptar la contraseña
        const hashedPassword = await encrypt(adminPassword);

        // Crear el usuario admin
        const admin = await UserModel.create({
            name: "Administrador",
            email: adminEmail,
            password: hashedPassword,
            description: "Usuario administrador del sistema",
            role: "admin"
        });

        console.log("✅ Usuario administrador creado exitosamente");
        console.log("📧 Email:", adminEmail);
        console.log("🔑 Password:", adminPassword);
        console.log("👤 Usuario ID:", admin._id);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error al crear administrador:", error);
        process.exit(1);
    }
};

createAdmin();
