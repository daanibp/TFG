const express = require("express");
const router = express.Router();
const { Matriculas } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
    try {
        const matriculas = await Matriculas.findAll();
        res.json(matriculas);
    } catch (error) {
        console.error("Error al buscar matriculaciones:", error);
        res.status(500).json({ error: "Error al buscar matriculaciones" });
    }
});

router.post("/addMatricula", async (req, res) => {
    const { estado, UsuarioId, AsignaturaId, GrupoId } = req.body;
    try {
        // Verifica si ya existe una matrícula con el mismo UsuarioId y AsignaturaId
        const existingMatricula = await Matriculas.findOne({
            where: {
                UsuarioId: UsuarioId,
                AsignaturaId: AsignaturaId,
                GrupoId: GrupoId,
            },
        });

        // Si ya existe una matrícula con los mismos valores, devuelve un error
        if (existingMatricula) {
            return res
                .status(400)
                .send("Ya existe una matrícula para este usuario y asignatura");
        }

        // Si no existe, crea la nueva matrícula
        await Matriculas.create({
            estado: estado,
            UsuarioId: UsuarioId,
            AsignaturaId: AsignaturaId,
            GrupoId: GrupoId,
        });

        console.log(`Matrícula creada correctamente`);
        res.status(201).send("Matrícula creada exitosamente");
    } catch (error) {
        console.error("Error al crear el matrícula:", error);
        res.status(500).send(
            "Error interno del servidor al crear la matrícula"
        );
    }
});

router.put("/aceptar/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const solicitud = await Matriculas.findByPk(id);

        // Verifica si la solicitud existe
        if (!solicitud) {
            return res.status(404).json({ error: "Matrícula no encontrada" });
        }

        // Actualiza el estado de la solicitud a "Aceptada"
        solicitud.estado = "Aceptada";
        await solicitud.save();

        // Devuelve la solicitud actualizada
        return res.json(solicitud);
    } catch (error) {
        console.error("Error al actualizar el estado de la matrícula:", error);
        return res.status(500).json({ error: "Error del servidor" });
    }
});

router.put("/denegar/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const solicitud = await Matriculas.findByPk(id);

        // Verifica si la solicitud existe
        if (!solicitud) {
            return res.status(404).json({ error: "Matrícula no encontrada" });
        }

        // Actualiza el estado de la solicitud a "Denegada"
        solicitud.estado = "Denegada";
        await solicitud.save();

        // Devuelve la solicitud actualizada
        return res.json(solicitud);
    } catch (error) {
        console.error("Error al actualizar el estado de la matrícula:", error);
        return res.status(500).json({ error: "Error del servidor" });
    }
});

router.post("/addLoteMatriculas", async (req, res) => {
    const { estado, UsuarioId, matriculas } = req.body;

    try {
        // Obtener los IDs de asignatura y grupo de las matrículas proporcionadas
        const asignaturaIds = matriculas.map(
            (matricula) => matricula.asignaturaId
        );
        const grupoIds = matriculas.map((matricula) => matricula.grupoId);

        // Verificar si ya existen matrículas para las asignaturas proporcionadas
        const existingMatriculas = await Matriculas.findAll({
            where: {
                UsuarioId: UsuarioId,
                AsignaturaId: {
                    [Op.in]: asignaturaIds,
                },
                GrupoId: {
                    [Op.in]: grupoIds,
                },
            },
        });

        // Si ya existen matrículas para alguna de las asignaturas, devuelve un error
        if (existingMatriculas.length > 0) {
            const duplicadas = existingMatriculas.map(
                (matricula) => matricula.AsignaturaId
            );
            return res.status(400).json({
                error: "Ya existen matrículas para algunas de las asignaturas proporcionadas",
                asignaturasDuplicadas: duplicadas,
            });
        }

        // Crea las matrículas para cada asignatura en el array
        const nuevasMatriculas = await Promise.all(
            matriculas.map(async (matricula) => {
                return await Matriculas.create({
                    estado: estado,
                    UsuarioId: UsuarioId,
                    AsignaturaId: matricula.asignaturaId,
                    GrupoId: matricula.grupoId,
                });
            })
        );

        console.log("Matrículas creadas correctamente");
        res.status(201).json(nuevasMatriculas);
    } catch (error) {
        console.error("Error al crear las matrículas:", error);
        res.status(500).send(
            "Error interno del servidor al crear las matrículas"
        );
    }
});

router.get("/checkMatriculada", async (req, res) => {
    const { UsuarioId, AsignaturaId } = req.query;

    try {
        // Verificar si existe una matrícula para el UsuarioId y AsignaturaId proporcionados
        const matricula = await Matriculas.findOne({
            where: {
                UsuarioId: UsuarioId,
                AsignaturaId: AsignaturaId,
            },
        });

        // Devolver si la asignatura está matriculada o no
        if (matricula) {
            res.json({ matriculada: true });
        } else {
            res.json({ matriculada: false });
        }
    } catch (error) {
        console.error(
            `Error al verificar matriculación de la asignatura ${AsignaturaId}:`,
            error
        );
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
