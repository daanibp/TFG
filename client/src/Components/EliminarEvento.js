import React from "react";
import axios from "axios";
import "../estilos/EliminarEvento.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { MdDelete } from "react-icons/md";

function EliminarEvento({ tipo, eventosFormateados, onEliminarEvento }) {
    console.log(eventosFormateados);

    const handleEliminarEvento = async (eventoId) => {
        try {
            // Realiza la solicitud de eliminación al servidor
            await axios.delete(
                `http://localhost:5001/eventos/delete/${eventoId}`
            );
            onEliminarEvento(eventoId, tipo);
        } catch (error) {
            console.error("Error al eliminar el evento:", error.message);
            // Maneja el error según tus necesidades
        }
    };

    const formatDate = (date) => {
        return dayjs(date).format("dddd, D [de] MMMM [de] YYYY [a las] HH:mm");
    };

    return (
        <div className="containerEliminarEvento">
            {tipo === "Examenes" || tipo === "Clases" ? (
                <div>
                    <h2>{tipo === "Examenes" ? "Exámenes:" : "Clases:"}</h2>
                    <br></br>
                    <div>
                        {eventosFormateados.map((evento) => (
                            <div key={evento.id}>
                                <label>{evento.title}</label>
                                <p>{evento.descripcion}</p>
                                <p>
                                    Fecha de inicio: {formatDate(evento.start)}
                                </p>
                                <p>Fecha de fin: {formatDate(evento.end)}</p>

                                <button
                                    onClick={() =>
                                        handleEliminarEvento(evento.id)
                                    }
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default EliminarEvento;
