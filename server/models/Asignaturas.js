module.exports = (sequelize, DataTypes) => {
    const Asignaturas = sequelize.define("Asignaturas", {
        nombreReal: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nombreHorario: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nombreExamen: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Asignaturas.associate = (models) => {
        Asignaturas.hasMany(models.Grupo, {
            onDelete: "cascade",
        });
    };

    Asignaturas.associate = (models) => {
        Asignaturas.hasMany(models.Matriculacion, {
            onDelete: "cascade",
        });
    };

    return Asignaturas;
};
