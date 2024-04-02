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
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    });

    Usuarios.associate = (models) => {
        Usuarios.hasMany(models.Eventos, {
            onDelete: "cascade",
        });
    };

    Usuarios.associate = (models) => {
        Usuarios.hasMany(models.SolicitudEvento, {
            onDelete: "cascade",
        });
    };

    return Usuarios;
};
