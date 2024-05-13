const express = require("express");
const router = express.Router();
const { Eventos } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const moment = require("moment");

router.get("/clases", async (req, res) => {
    const eventos = await Eventos.findAll({
        where: { examen: false },
    });
    res.json(eventos);
});
router.get("/examenes", async (req, res) => {
    const eventos = await Eventos.findAll({
        where: { examen: true },
    });
    res.json(eventos);
});

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
        const nuevosEventos = req.body; // Array de eventos nuevos
        // console.log("Nuevos Eventos", nuevosEventos);

        // Verificar si hay eventos en la base de datos
        const eventosEnBD = await Eventos.findAll();
        let eventosAgregados = 0;

        // Si no hay eventos en la base de datos, crear todos los eventos nuevos
        if (eventosEnBD.length === 0) {
            await Eventos.bulkCreate(nuevosEventos);
            eventosAgregados = nuevosEventos.length;
        } else {
            // Iterar sobre cada evento nuevo
            for (const nuevoEvento of nuevosEventos) {
                // Convertir las fechas de los nuevos eventos al formato Date
                nuevoEvento.fechaDeComienzo = new Date(
                    nuevoEvento.fechaDeComienzo
                );
                nuevoEvento.fechaDeFinalización = new Date(
                    nuevoEvento.fechaDeFinalización
                );

                // Verificar si el evento nuevo ya existe en la base de datos
                const eventoExistente = eventosEnBD.find((evento) => {
                    // Convertir las fechas de la base de datos al formato Date
                    const fechaFormateadaBD = new Date(evento.fechaDeComienzo);

                    return (
                        evento.asunto === nuevoEvento.asunto &&
                        fechaFormateadaBD.getTime() ===
                            nuevoEvento.fechaDeComienzo.getTime() &&
                        evento.comienzo === nuevoEvento.comienzo &&
                        fechaFormateadaBD.getTime() ===
                            nuevoEvento.fechaDeFinalización.getTime() &&
                        evento.finalización === nuevoEvento.finalización &&
                        evento.todoElDía === nuevoEvento.todoElDía &&
                        evento.reminder === nuevoEvento.reminder &&
                        evento.reminderDate === nuevoEvento.reminderDate &&
                        evento.reminderTime === nuevoEvento.reminderTime &&
                        evento.meetingOrganizer ===
                            nuevoEvento.meetingOrganizer &&
                        evento.description === nuevoEvento.description &&
                        evento.location === nuevoEvento.location &&
                        evento.priority === nuevoEvento.priority &&
                        evento.private === nuevoEvento.private &&
                        evento.sensitivity === nuevoEvento.sensitivity &&
                        evento.showTimeAs ===
                            nuevoEvento.showTimeAs.toString() &&
                        evento.examen === nuevoEvento.examen &&
                        evento.UsuarioId === nuevoEvento.UsuarioId
                    );
                });

                // Si el evento no existe, agregarlo a la base de datos
                if (!eventoExistente) {
                    await Eventos.create(nuevoEvento);
                    eventosAgregados++;
                }
            }
        }

        if (eventosAgregados === 0) {
            console.log(`No se agregó ningún evento`);
            res.json({
                message: `No se agregó ningún evento`,
            });
        } else {
            console.log(
                `Se agregaron ${eventosAgregados} eventos correctamente.`
            );
            res.json({
                message: `Se agregaron ${eventosAgregados} eventos correctamente.`,
            });
        }
    } catch (error) {
        console.error("Error al agregar eventos:", error.message);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

module.exports = router;
