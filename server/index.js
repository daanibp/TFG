const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
const usuariosRouter = require("./routes/Usuarios");
app.use("/usuarios", usuariosRouter);

db.sequelize.sync().then(() => {
    app.listen(5001, () => {
        console.log("Server running on port 5001");
    });
});
