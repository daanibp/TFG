module.exports = (sequelize, DataTypes) => {
    const Usuarios = sequelize.define("Usuarios", {
        uo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Usuarios;
};
