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

router.post("/addAsignatura", validateToken, (req, res) => {
    const { nombreReal, nombreHorario, nombreExamen } = req.body;
    Asignaturas.create({
        nombreReal: nombreReal,
        nombreHorario: nombreHorario,
        nombreExamen: nombreExamen,
    });
});

module.exports = router;
