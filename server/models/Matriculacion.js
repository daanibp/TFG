module.exports = (sequelize, DataTypes) => {
    const Matriculacion = sequelize.define("Matriculacion", {
        UsuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        AsignaturaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    return Matriculacion;
};