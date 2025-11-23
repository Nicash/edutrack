// Librerías externas
import { Router } from "express";
import { readdirSync } from "fs";

const PATH_ROUTER = `${__dirname}`; // Representa la ruta del directorio actual donde se encuentra este archivo
const router = Router();

// Función para limpiar el nombre del archivo
// Elimina la extensión del archivo
const clearFileName = (fileName: string) => {
  return fileName.split(".").shift();
};

// Función para leer los archivos del directorio y cargarlos dinámicamente
// Lee todos los archivos del directorio actual y filtra para obtener solo los archivos
readdirSync(PATH_ROUTER).forEach((fileName) => {
    const clearName = clearFileName(fileName); // Obtenemos el nombre de los archivos sin extensión
    // Descartamos el nombre de index, ya que no lo necesitamos
    if (clearName !== "index") {
        // Se importa dinámicamente el archivo como módulo
        import(`./${clearName}`).then((moduleRouter) => {
            router.use(`/${clearName}`, moduleRouter.router); // Se monta la ruta en express
        });
    }
});

export { router };