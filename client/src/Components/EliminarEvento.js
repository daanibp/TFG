import { React, useState } from "react";
import axios from "axios";
import "../estilos/EliminarEvento.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { MdDelete } from "react-icons/md";

function EliminarEvento({ tipo, eventosFormateados, onEliminarEvento }) {
    console.log(eventosFormateados);

    const [creadosPorMi, setCreadosPorMi] = useState(false);

    const handleEliminarEvento = async (eventoId) => {
        try {
            await axios.delete(
                `http://localhost:5001/eventos/delete/${eventoId}`
            );
            onEliminarEvento(eventoId, tipo);
        } catch (error) {
            console.error("Error al eliminar el evento:", error.message);
        }
    };

    const formatDate = (date) => {
        return dayjs(date).format("dddd, D [de] MMMM [de] YYYY [a las] HH:mm");
    };

    const handleCheckboxChange = () => {
        setCreadosPorMi(!creadosPorMi);
    };

    const filteredEventos = creadosPorMi
        ? eventosFormateados.filter((evento) => evento.creadoPorMi)
        : eventosFormateados;

    return (
        <div className="containerEliminarEvento">
            <div className="TituloEliminarEvento">
                <h1>Eliminar Eventos</h1>
            </div>
            <div className="FiltroEventos">
                <label>
                    Mostrar solo eventos creados por mí
                    <input
                        type="checkbox"
                        checked={creadosPorMi}
                        onChange={handleCheckboxChange}
                    />
                </label>
            </div>
            {tipo === "Examenes" || tipo === "Clases" ? (
                <div className="ContainerEventos">
                    <h2>{tipo === "Examenes" ? "Exámenes:" : "Clases:"}</h2>
                    <br></br>
                    <div className="SitioEventos">
                        {filteredEventos.length > 0 ? (
                            filteredEventos.map((evento) => (
                                <div key={evento.id}>
                                    <label>{evento.title}</label>
                                    <p>{evento.descripcion}</p>
                                    <p>
                                        Fecha de inicio:{" "}
                                        {formatDate(evento.start)}
                                    </p>
                                    <p>
                                        Fecha de fin: {formatDate(evento.end)}
                                    </p>

                                    <button
                                        onClick={() =>
                                            handleEliminarEvento(evento.id)
                                        }
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No hay eventos de este tipo</p>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default EliminarEvento;
