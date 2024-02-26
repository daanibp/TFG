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

module.exports = router;
