const express = require("express");
const router = express.Router();
const { Usuarios } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    const { uo, password } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        Usuarios.create({
            uo: uo,
            password: hash,
            admin: 0,
        });
        res.json("SUCCESS");
    });
});

router.post("/login", async (req, res) => {
    const { uo, password } = req.body;

    const user = await Usuarios.findOne({ where: { uo: uo } });

    if (!user) return res.json({ error: "No existe este usuario" });

    bcrypt.compare(password, user.password).then((match) => {
        if (!match)
            return res.json({
                error: "Usuario o contraseña erróneos",
            });

        const accessToken = sign(
            { uo: user.uo, id: user.id, admin: user.admin },
            "importantsecret"
        );

        return res.json({
            token: accessToken,
            uo: uo,
            id: user.id,
            admin: user.admin,
        });
    });
});

router.get("/auth", validateToken, (req, res) => {
    res.json(req.user);
});

router.post("/crearadmin", validateToken, (req, res) => {
    const { uo, password } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        Usuarios.create({
            uo: uo,
            password: hash,
            admin: 1,
        });
        res.json("SUCCESS");
    });
});

module.exports = router;
