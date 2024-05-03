const express = require("express");
const router = express.Router();
const { Eventos } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/:usuarioId", async (req, res) => {
    const usuarioId = req.params.usuarioId;
    const eventos = await Eventos.findAll({
        where: { UsuarioId: usuarioId, examen: false },
    });
    res.json(eventos);
});

router.get("/ex/:usuarioId", async (req, res) => {
    const usuarioId = req.params.usuarioId;
    const eventos = await Eventos.findAll({
        where: { UsuarioId: usuarioId, examen: true },
    });
    res.json(eventos);
});

router.post("/addEvent", async (req, res) => {
    const {
        asunto,
        fechaDeComienzo,
        comienzo,
        fechaDeFinalización,
        finalización,
        todoElDía,
        reminder,
        reminderDate,
        reminderTime,
        meetingOrganizer,
        requiredAttendees,
        optionalAttendees,
        recursosDeLaReunión,
        billingInformation,
        categories,
        description,
        location,
        mileage,
        priority,
        private,
        sensitivity,
        showTimeAs,
        examen,
        UsuarioId,
    } = req.body;

    const nuevoEvento = await Eventos.create({
        asunto,
        fechaDeComienzo,
        comienzo,
        fechaDeFinalización,
        finalización,
        todoElDía,
        reminder,
        reminderDate,
        reminderTime,
        meetingOrganizer,
        requiredAttendees: requiredAttendees || null,
        optionalAttendees: optionalAttendees || null,
        recursosDeLaReunión: recursosDeLaReunión || null,
        billingInformation: billingInformation || null,
        categories: categories || null,
        description,
        location: location || null,
        mileage: mileage || null,
        priority,
        private,
        sensitivity,
        showTimeAs,
        examen,
        UsuarioId,
    });
    res.json(nuevoEvento);
});

router.delete("/delete/:eventoId", async (req, res) => {
    const eventoId = req.params.eventoId;

    try {
        // Intenta encontrar el evento por su ID
        const eventoAEliminar = await Eventos.findByPk(eventoId);

        if (!eventoAEliminar) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        // Elimina el evento
        await eventoAEliminar.destroy();

        res.json({ message: "Evento eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar el evento:", error.message);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post("/addLoteEventos", async (req, res) => {
    try {
        const eventos = req.body; // Array de eventos

        // Contador para llevar el registro de los eventos agregados
        let eventosAgregados = 0;

        // Iterar sobre cada evento en el array
        for (const evento of eventos) {
            // Verificar si el evento ya existe en la base de datos
            const eventoExistente = await Eventos.findOne({
                where: { id: evento.id },
            });

            // Si el evento no existe, agregarlo a la base de datos
            if (!eventoExistente) {
                await Eventos.create(evento);
                eventosAgregados++;
            }
        }

        // Responder con un mensaje indicando cuántos eventos se agregaron correctamente
        res.json({
            message: `Se agregaron ${eventosAgregados} eventos correctamente.`,
        });
    } catch (error) {
        console.error("Error al agregar eventos:", error.message);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

module.exports = router;
