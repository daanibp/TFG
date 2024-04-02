const express = require("express");
const router = express.Router();
const { SolicitudEvento } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", async (req, res) => {
    const solicitudesEventos = await SolicitudEvento.findAll({
        where: {},
    });
    res.json(solicitudesEventos);
});

router.post("/addSolicitudEvento", async (req, res) => {
    const { estado, UsuarioId } = req.body;

    const nuevaSolicitudEvento = await SolicitudEvento.create({
        estado,
        UsuarioId,
    });
    res.json(nuevaSolicitudEvento);
});

module.exports = router;
