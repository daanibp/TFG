module.exports = (sequelize, DataTypes) => {
    const SolicitudEvento = sequelize.define("SolicitudEvento", {
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    SolicitudEvento.associate = (models) => {
        SolicitudEvento.hasOne(models.EventosGlobales, {
            foreignKey: "solicitudEventoId",
        });
    };

    return SolicitudEvento;
};
