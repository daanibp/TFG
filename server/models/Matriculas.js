module.exports = (sequelize, DataTypes) => {
    const Matriculas = sequelize.define("Matriculas", {
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        UsuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        AsignaturaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        GrupoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    Matriculas.associate = (models) => {
        Matriculas.belongsTo(models.Grupo, {
            foreignKey: "GrupoId",
        });
    };

    return Matriculas;
};
