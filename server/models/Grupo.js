module.exports = (sequelize, DataTypes) => {
    const Grupo = sequelize.define("Grupo", {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        AsignaturaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    return Grupo;
};
