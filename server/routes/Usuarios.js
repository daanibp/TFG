const express = require("express");
const router = express.Router();
const { Usuarios } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign, verify } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Configuración de Nodemailer para Outlook
const transporter = nodemailer.createTransport({
    host: "smtp.office365.com", // Servidor SMTP de Outlook
    port: 587,
    // host: "relay.uniovi.es",
    // port: 25,
    secure: false, // true para el puerto 465, false para otros puertos
    auth: {
        user: "MiAreaPersonal@outlook.com",
        pass: "MiTFG/2024",
    },
    // auth: {
    //     user: "uo277476@uniovi.es",
    //     pass: "dasdasd",
    // },
    tls: {
        ciphers: "SSLv3",
    },
});
const jwtSecret = "importantsecret";

router.post("/register", async (req, res) => {
    const { uo, newPassword } = req.body;

    try {
        const user = await Usuarios.findOne({ where: { uo: uo } });

        if (!user) {
            return res
                .status(400)
                .json({ error: "Usuario no registrado en el sistema" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const token = sign({ uo: uo }, jwtSecret, { expiresIn: "1h" });

        await Usuarios.update(
            { password: hashedPassword, estado: "Pendiente" },
            { where: { uo: uo } }
        );

        const mailOptions = {
            from: "MiAreaPersonal@outlook.com",
            to: user.email,
            subject: "Validación de cuenta",
            text: `Haz clic en el siguiente enlace para validar tu cuenta: http://localhost:5001/usuarios/validate/${token}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res
                    .status(500)
                    .json({ error: "Error al enviar el correo de validación" });
            }
            return res
                .status(200)
                .json({ message: "Correo de validación enviado" });
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// Ruta para la validación del usuario
router.get("/validate/:token", async (req, res) => {
    const { token } = req.params;

    try {
        // Verificar y decodificar el token
        const decoded = verify(token, jwtSecret);
        const { uo } = decoded;

        // Actualizar el estado del usuario a "Activa"
        await Usuarios.update({ estado: "Activa" }, { where: { uo: uo } });

        // Responder al usuario con un mensaje de éxito
        res.status(200).send(
            "Cuenta activada correctamente. Ahora puedes iniciar sesión."
        );
    } catch (error) {
        // Manejar errores de token inválido o caducado
        res.status(400).send(
            "Enlace de validación inválido o caducado. Por favor, solicita un nuevo enlace."
        );
    }
});

router.post("/", async (req, res) => {
    const { uo, password, profesor, estado } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        Usuarios.create({
            uo: uo,
            password: hash,
            email: uo + "@uniovi.es",
            admin: 0,
            profesor: profesor,
            estado: estado,
        });
        res.json("SUCCESS");
    });
});

router.post("/login", async (req, res) => {
    const { uo, password } = req.body;

    const user = await Usuarios.findOne({ where: { uo: uo } });

    if (!user) return res.json({ error: "No existe este usuario" });

    // Verificar el estado de la cuenta del usuario
    if (user.estado !== "Activa") {
        return res.json({
            error: "La cuenta de este usuario no está activa. Regístrate.",
        });
    }

    bcrypt.compare(password, user.password).then((match) => {
        if (!match)
            return res.json({
                error: "Usuario o contraseña erróneos",
            });

        const accessToken = sign(
            {
                uo: user.uo,
                id: user.id,
                admin: user.admin,
                email: user.email,
                profesor: user.profesor,
                estado: user.estado,
            },
            "importantsecret"
        );

        return res.json({
            token: accessToken,
            uo: uo,
            id: user.id,
            admin: user.admin,
            email: user.email,
            profesor: user.profesor,
            estado: user.estado,
        });
    });
});

router.get("/auth", validateToken, (req, res) => {
    res.json(req.user);
});

router.post("/crearadmin", async (req, res) => {
    const { uo, password } = req.body;
    const profesor = 0;
    const estado = "Inactiva";

    try {
        // Verificar si ya existe un administrador con el mismo UO
        const existingAdmin = await Usuarios.findOne({ where: { uo: uo } });
        if (existingAdmin) {
            // Si ya existe, devolver un error
            return res.status(400).json({
                error: "Ya existe un administrador con este UO",
            });
        }

        // Si no existe, proceder con la creación del administrador
        const hash = await bcrypt.hash(password, 10);
        await Usuarios.create({
            uo: uo,
            password: hash,
            email: `${uo}@uniovi.es`,
            admin: 1,
            profesor: profesor,
            estado: estado,
        });
        res.json("SUCCESS");
    } catch (error) {
        res.status(500).json({
            error: "Hubo un error al crear el administrador",
        });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await Usuarios.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        return res.json({ uo: user.uo });
    } catch (error) {
        console.error("Error al buscar el usuario:", error);
        return res.status(500).json({ error: "Error del servidor" });
    }
});

router.get("/allUsers/all", async (req, res) => {
    try {
        // Obtener todos los usuarios de la base de datos
        const usuarios = await Usuarios.findAll();

        // Mapear los usuarios para obtener solo el ID y el nombre
        const usuariosConNombre = usuarios.map((usuario) => {
            return {
                id: usuario.id,
                uo: usuario.uo,
                email: usuario.email,
                admin: usuario.admin,
                profesor: usuario.profesor,
                estado: usuario.estado,
            };
        });

        // Responder con la lista de usuarios y sus IDs
        res.json(usuariosConNombre);
    } catch (error) {
        console.error("Error al obtener todos los usuarios:", error);
        res.status(500).json({
            error: "Error del servidor al obtener usuarios",
        });
    }
});

// Ruta para crear múltiples usuarios a partir de un array de UOs
router.post("/addLoteUsuarios/alumnos/inactivos", async (req, res) => {
    const usuarios = req.body;
    const usuariosCreados = [];
    const usuariosExistentes = [];

    // Verificar que 'usuarios' es un array de objetos que contienen 'uo'
    if (
        !Array.isArray(usuarios) ||
        !usuarios.every((usuario) => typeof usuario.uo === "string")
    ) {
        return res.status(400).json({
            error: "El input debe ser un array de objetos que contienen 'uo'",
        });
    }

    try {
        for (const usuario of usuarios) {
            const { uo } = usuario;

            // Verificar si el usuario ya existe
            const usuarioExistente = await Usuarios.findOne({ where: { uo } });
            if (!usuarioExistente) {
                // Hashear la contraseña
                const hashedPassword = await bcrypt.hash("pass", 10);

                // Crear el usuario
                const nuevoUsuario = await Usuarios.create({
                    uo: uo,
                    password: hashedPassword,
                    email: `${uo}@uniovi.es`,
                    admin: false,
                    profesor: false,
                    estado: "Inactiva",
                });

                usuariosCreados.push(nuevoUsuario);
            } else {
                usuariosExistentes.push(usuarioExistente);
            }
        }

        // Obtener todos los usuarios después de crear los nuevos
        const todosLosUsuarios = await Usuarios.findAll();

        console.log("Usuarios creados exitosamente: ", usuariosCreados.length);
        return res.status(201).json({
            message: "Usuarios creados exitosamente",
            usuariosCreados,
            usuariosExistentes,
            todosLosUsuarios,
        });
    } catch (error) {
        console.error("Error al crear los usuarios:", error);
        return res
            .status(500)
            .send("Error interno del servidor al crear los usuarios");
    }
});

module.exports = router;
