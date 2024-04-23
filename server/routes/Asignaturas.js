const express = require("express");
const router = express.Router();
const { Asignaturas } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", async (req, res) => {
    const asignaturas = await Asignaturas.findAll({
        where: {},
    });
    res.json(asignaturas);
});

router.post("/addAsignatura", async (req, res) => {
    const { idAsignatura, nombreReal, nombreHorario, nombreExamen } = req.body;
    try {
        await Asignaturas.create({
            idAsignatura: idAsignatura,
            nombreReal: nombreReal,
            nombreHorario: nombreHorario,
            nombreExamen: nombreExamen,
        });
        console.log("Asignatura " + idAsignatura + " creada");
        res.status(200).send("Asignatura creada exitosamente");
    } catch (error) {
        console.error("Error al crear la asignatura:", error);
        res.status(500).send(
            "Error interno del servidor al crear la asignatura"
        );
    }
});

router.post("/addLoteAsignaturas", async (req, res) => {
    const { asignaturas } = req.body;
    try {
        // Insertar todas las asignaturas en la base de datos en una sola operación
        await Asignaturas.bulkCreate(asignaturas);
        console.log("Asignaturas creadas exitosamente");
        res.status(200).send("Asignaturas creadas exitosamente");
    } catch (error) {
        console.error("Error al crear las asignaturas:", error);
        res.status(500).send(
            "Error interno del servidor al crear las asignaturas"
        );
    }
});

router.get("/existeIdAsignatura/:idAsignatura", async (req, res) => {
    const idAsignatura = req.params.idAsignatura;
    try {
        // Buscar en la base de datos si existe algún registro con el idAsignatura proporcionado
        const asignaturaExistente = await Asignaturas.findOne({
            where: {
                idAsignatura: idAsignatura,
            },
        });

        // Si se encuentra una asignatura con el mismo idAsignatura, devolver true
        // Si no se encuentra, devolver false
        const existe = asignaturaExistente !== null;
        res.json({ existe: existe });
    } catch (error) {
        console.error(
            "Error al verificar la existencia del idAsignatura:",
            error
        );
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/:idAsignatura", async (req, res) => {
    const idAsignatura = req.params.idAsignatura;
    try {
        // Buscar en la base de datos la asignatura con el id proporcionado
        const asignatura = await Asignaturas.findOne({
            where: {
                idAsignatura: idAsignatura,
            },
        });

        // Si se encuentra la asignatura, devolver su ID
        // Si no se encuentra, devolver un mensaje indicando que no se encontró la asignatura
        if (asignatura) {
            res.json({ idAsignatura: asignatura.id });
        } else {
            res.status(404).json({ error: "Asignatura no encontrada" });
        }
    } catch (error) {
        console.error("Error al buscar la asignatura:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
