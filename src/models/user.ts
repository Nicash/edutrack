// Schema sirve para definir la estructura de los documentos en una colección de MongoDB
// Model convierte un Schema en un modelo, que es el que permite interactuar con la base de datos

// Librerías externas
import { Schema, model } from "mongoose";

// Módulos locales
import { User } from "../interfaces/user.interface";

// Creación del Schema del usuario
const UserSchema = new Schema<User>(
    {
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            default: "---",
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        subscriptions: {
            type: [Schema.Types.ObjectId],
            ref: "subjects",
            default: [],
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Creación del modelo de usuario
const UserModel = model("users", UserSchema);

export default UserModel
