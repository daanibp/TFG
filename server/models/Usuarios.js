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

    Usuarios.associate = (models) => {
        Usuarios.hasMany(models.Eventos, {
            onDelete: "cascade",
        });
    };

    return Usuarios;
};
