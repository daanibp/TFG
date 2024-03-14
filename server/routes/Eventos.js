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

module.exports = router;
