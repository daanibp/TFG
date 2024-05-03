const express = require("express");
const router = express.Router();
const { Grupo } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", async (req, res) => {
    const grupos = await Grupo.findAll({
        where: {},
    });
    res.json(grupos);
});

router.post("/addGrupo", async (req, res) => {
    const { nombre, tipo, AsignaturaId } = req.body;
    try {
        await Grupo.create({
            nombre: nombre,
            tipo: tipo,
            AsignaturaId: AsignaturaId,
        });
        console.log(`Grupo ${nombre} creado`);
        res.status(201).send("Grupo creado exitosamente");
    } catch (error) {
        console.error("Error al crear el grupo:", error);
        res.status(500).send("Error interno del servidor al crear el grupo");
    }
});

router.post("/addGrupos", async (req, res) => {
    const grupos = req.body; // Suponiendo que req.body es un arreglo de grupos
    try {
        // Insertar todos los grupos en la base de datos
        await Grupo.bulkCreate(grupos);
        console.log("Creando los siguientes Grupos: ", grupos);
        console.log("Grupos creados exitosamente");
        res.status(201).send("Grupos creados exitosamente");
    } catch (error) {
        console.error("Error al crear los grupos:", error);
        res.status(500).send("Error interno del servidor al crear los grupos");
    }
});

router.get("/asignaturas/:asignaturaId/grupos", async (req, res) => {
    const { asignaturaId } = req.params;

    try {
        // Buscar todos los grupos asociados a la asignatura especificada
        const grupos = await Grupo.findAll({
            where: {
                AsignaturaId: asignaturaId,
            },
        });

        // Devolver los grupos encontrados
        res.json(grupos);
    } catch (error) {
        console.error("Error al buscar los grupos de la asignatura:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
