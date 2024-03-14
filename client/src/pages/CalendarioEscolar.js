import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Calendario from "../Components/Calendario";
import Sidebar from "../Components/Sidebar";
import AñadirEvento from "../Components/AñadirEvento";
import EliminarEvento from "../Components/EliminarEvento";
import { AuthContext } from "../helpers/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import Papa from "papaparse";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Madrid");

function CalendarioEscolar() {
    const { authState } = useContext(AuthContext);
    let { id } = useParams();

    const [eventos, setEventos] = useState([]);
    const [eventosExamenes, setEventosExamenes] = useState([]);
    const [mostrarTipoEventos, setMostrarTipoEventos] = useState("Clases");
    const [mostrarMensajeG, setMostrarMensajeG] = useState(false);
    const [mostrarMensajeA, setMostrarMensajeA] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarMensajeAñadido, setMostrarMensajeAñadido] = useState(false);
    const [borrarEvento, setBorrarEvento] = useState(false);

    let navigate = useNavigate();

    const MessageBoxGoogle = ({ message, onConfirm, onCancel }) => {
        return (
            <div className="message-box">
                <p>{message}</p>
                <button onClick={onConfirm}>Sí</button>
                <button onClick={onCancel}>No</button>
            </div>
        );
    };

    const MessageBoxApple = ({ message, onCancel }) => {
        return (
            <div className="message-box">
                <p>{message}</p>
                <button onClick={onCancel}>Vale</button>
            </div>
        );
    };

    useEffect(() => {
        axios.get(`http://localhost:5001/eventos/${id}`).then((response) => {
            console.log("Clases: ", response.data);
            setEventos(response.data);
        });
        axios.get(`http://localhost:5001/eventos/ex/${id}`).then((response) => {
            console.log("Examenes: ", response.data);
            setEventosExamenes(response.data);
        });
    }, [id]);

    // Función para manejar el clic en los botones
    const handleTipoEventosClick = (tipo) => {
        setMostrarTipoEventos(tipo);
    };

    // Obtener los eventos según el tipo seleccionado
    const eventosMostrados =
        mostrarTipoEventos === "Clases" ? eventos : eventosExamenes;

    function formatearFecha(fechaOriginal, horas, minutos) {
        // Parsear la fecha original con dayjs
        const fechaParseada = dayjs(fechaOriginal);

        // Establecer las nuevas horas y minutos
        const nuevaFecha = fechaParseada
            .set("hour", horas)
            .set("minute", minutos);

        // Formatear la nueva fecha según el formato deseado
        const fechaFormateada = nuevaFecha.format("YYYY-MM-DDTHH:mm:ss");

        return fechaFormateada;
    }

    function obtenerHoraDesdeCadena(cadenaHora) {
        return dayjs.tz(`1970-01-01T${cadenaHora}`, "Europe/Madrid").hour();
    }

    function obtenerMinutosDesdeCadena(cadenaHora) {
        return dayjs.tz(`1970-01-01T${cadenaHora}`, "Europe/Madrid").minute();
    }

    const eventosFormateados = [];

    eventosMostrados.forEach((evento) => {
        eventosFormateados.push({
            id: evento.id,
            start: dayjs
                .tz(
                    formatearFecha(
                        evento.fechaDeComienzo,
                        obtenerHoraDesdeCadena(evento.comienzo),
                        obtenerMinutosDesdeCadena(evento.comienzo)
                    ),
                    "Europe/Madrid"
                )
                .toDate(),
            end: dayjs
                .tz(
                    formatearFecha(
                        evento.fechaDeFinalización,
                        obtenerHoraDesdeCadena(evento.finalización),
                        obtenerMinutosDesdeCadena(evento.finalización)
                    ),
                    "Europe/Madrid"
                )
                .toDate(),
            title: evento.asunto,
            descripcion: evento.description,
        });
    });

    //console.log("Eventos", eventos);
    //console.log("EventosFormateados", eventosFormateados); // aquí se consiguen bien bien

    const mostrarOcultarMensaje = useCallback(
        (tipoMensaje) => {
            switch (tipoMensaje) {
                case "Google":
                    setMostrarMensajeG(
                        (prevMostrarMensajeG) => !prevMostrarMensajeG
                    );
                    setMostrarMensajeA(false);
                    break;
                case "Apple":
                    setMostrarMensajeA(
                        (prevMostrarMensajeA) => !prevMostrarMensajeA
                    );
                    setMostrarMensajeG(false);
                    break;
                case "Añadir":
                    setMostrarFormulario(
                        (prevMostrarFormulario) => !prevMostrarFormulario
                    );
                    setBorrarEvento(false);
                    break;
                case "Borrar":
                    setBorrarEvento((prevBorrarEvento) => !prevBorrarEvento);
                    setMostrarFormulario(false);
                    break;
                default:
                    break;
            }
        },
        [setMostrarMensajeG, setMostrarMensajeA]
    );

    // crear .csv
    let data = [];
    eventosMostrados.forEach((evento) => {
        let temp = {
            Asunto: evento.asunto,
            Fechadecomienzo: evento.fechaDeComienzo,
            Comienzo: evento.comienzo,
            Fechadefinalización: evento.fechaDeFinalización,
            Finalización: evento.finalización,
            Todoeldia: evento.todoElDía,
            Reminder: evento.reminder,
            ReminderDate: evento.reminderDate,
            ReminderTime: evento.reminderDate,
            MeetingOrganizer: evento.meetingOrganizer,
            RequiredAttendees: evento.requiredAttendees,
            OptionalAttendees: evento.optionalAttendees,
            Recursosdelareunion: evento.recursosDeLaReunión,
            BillingInformation: evento.BillingInformation,
            Categories: evento.categories,
            Description: evento.description,
            Location: evento.location,
            Mileage: evento.mileage,
            Priority: evento.priority,
            Private: evento.private,
            Sensitivity: evento.sensitivity,
            Showtimeas: evento.showTimeAs,
            Examen: evento.examen,
        };
        data.push(temp);
    });
    //console.log("Eventos para el CSV: ", data);

    // Función para dejar el formato correcto para la creación del csv
    const formatearDatos = (data) => {
        const eventosFormateadosCSV = data.map((evento) => {
            const fechaInicio = new Date(evento.Fechadecomienzo);
            const fechaFinalizacion = new Date(evento.Fechadefinalización);
            const fechaReminder = new Date(evento.ReminderDate);

            return {
                Asunto: evento.Asunto,
                "Fecha de comienzo": fechaInicio.toLocaleDateString(),
                Comienzo: evento.Comienzo,
                "Fecha de finalización": fechaFinalizacion.toLocaleDateString(),
                Finalización: evento.Finalización,
                "Todo el día": evento.Todoeldia ? "VERDADERO" : "FALSO",
                "Reminder on/off": evento.Reminder ? "VERDADERO" : "FALSO",
                "Reminder Date": fechaReminder.toLocaleDateString(),
                "Reminder Time": evento.ReminderTime,
                "Meeting Organizer": evento.MeetingOrganizer,
                "Required Attendees": evento.RequiredAttendees,
                "Optional Attendees": evento.OptionalAttendees,
                "Recursos de la reuniÃƒÂ³n": evento.Recursosdelareunion,
                "Billing Information": evento.BillingInformation,
                Categories: evento.Categories,
                Description: evento.Description,
                Location: evento.Location,
                Mileage: evento.Mileage,
                Priority: evento.Priority,
                Private: evento.Private ? "VERDADERO" : "FALSO",
                Sensitivity: evento.Sensitivity,
                "Show time as": evento.Showtimeas,
            };
        });

        return eventosFormateadosCSV;
    };

    // Llama a la función para formatear los datos antes de convertir y descargar el archivo CSV
    const eventosCSV = formatearDatos(data);

    // Función para convertir y descargar el archivo CSV
    const convertirYDescargarCSV = () => {
        const nombreArchivo =
            mostrarTipoEventos === "Examenes"
                ? "CalendarioExamenes.csv"
                : "Horario.csv";

        const csv = Papa.unparse(eventosCSV);
        const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], {
            type: "text/csv;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);

        // Crea un enlace de descarga
        const a = document.createElement("a");
        a.href = url;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();

        // Limpia el enlace y la URL
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Abre una nueva pestaña de Google Calendar
        window.open("https://calendar.google.com/", "_blank");
    };

    // Función para agregar un evento al estado
    const agregarEvento = (nuevoEvento) => {
        if (!nuevoEvento.examen) {
            setEventos((prevEventos) => [...prevEventos, nuevoEvento]);
        } else if (nuevoEvento.examen) {
            setEventosExamenes((prevEventosExamenes) => [
                ...prevEventosExamenes,
                nuevoEvento,
            ]);
        } else {
            return;
        }
        setMostrarFormulario(false);
        // Mostrar el mensaje temporal
        setMostrarMensajeAñadido(true);
        // Ocultar el mensaje después de 1 segundo
        setTimeout(() => {
            setMostrarMensajeAñadido(false);
        }, 1000);
    };

    // Función para eliminar un evento del estado
    const eliminarEvento = (eventoId, tipo) => {
        if (tipo === "Clases") {
            setEventos((prevEventos) =>
                prevEventos.filter((evento) => evento.id !== eventoId)
            );
        } else if (tipo === "Examenes") {
            setEventosExamenes((prevEventosExamenes) =>
                prevEventosExamenes.filter((evento) => evento.id !== eventoId)
            );
        }
    };

    return (
        <AuthContext.Provider value={{ authState }}>
            {!authState.status ? (
                <div className="container">
                    <h1 className="title">Mi Área Personal</h1>
                    <h3 className="subtitle">
                        Inicia sesión para acceder a tu área personal
                    </h3>
                </div>
            ) : authState.id !== parseInt(id, 10) ? (
                navigate("/PageNotFound")
            ) : (
                <div className="sidebar-calendar">
                    <div id="miSidebar">
                        <Sidebar id={authState.id} isAdmin={authState.admin} />
                    </div>
                    <div className="box">
                        <div className="boxTitleLabel">
                            <div className="titleLabel">
                                Mi Calendario Escolar
                            </div>
                        </div>
                        <div className="opcionesBotones">
                            <div className="HorarioYCalendario">
                                <button
                                    id="HorarioDeClases"
                                    onClick={() =>
                                        handleTipoEventosClick("Clases")
                                    }
                                    className={
                                        mostrarTipoEventos === "Clases"
                                            ? "boton-activo"
                                            : ""
                                    }
                                >
                                    <div className="txtHorCl">
                                        Horario de Clases
                                    </div>
                                </button>
                                <button
                                    id="HorarioDeExamenes"
                                    onClick={() =>
                                        handleTipoEventosClick("Examenes")
                                    }
                                    className={
                                        mostrarTipoEventos === "Examenes"
                                            ? "boton-activo"
                                            : ""
                                    }
                                >
                                    <div className="txtHorEx">
                                        Calendario de Exámenes
                                    </div>
                                </button>
                            </div>
                            <div className="EspacioAñadirEvento">
                                <button
                                    id="AddEvent"
                                    onClick={() =>
                                        mostrarOcultarMensaje("Añadir")
                                    }
                                >
                                    <div className="addEvent">
                                        <IoIosAddCircle />
                                    </div>
                                </button>
                                <button
                                    id="DeleteEvent"
                                    onClick={() =>
                                        mostrarOcultarMensaje("Borrar")
                                    }
                                >
                                    <div className="deleteEvent">
                                        <TiDelete />
                                    </div>
                                </button>
                            </div>
                            {mostrarFormulario && (
                                <AñadirEvento
                                    id={id}
                                    onAgregarEvento={agregarEvento}
                                    tipo={mostrarTipoEventos}
                                    isGlobal={false}
                                />
                            )}
                            {mostrarMensajeAñadido && (
                                <div className="mensaje-temporal-añadido">
                                    Evento añadido correctamente
                                </div>
                            )}
                            {borrarEvento && (
                                <EliminarEvento
                                    tipo={mostrarTipoEventos}
                                    eventosFormateados={eventosFormateados}
                                    onEliminarEvento={eliminarEvento}
                                />
                            )}
                            <div className="EspacioGoogleApple">
                                <button
                                    onClick={() =>
                                        mostrarOcultarMensaje("Google")
                                    }
                                    id="Google"
                                >
                                    <div className="logoGoogle">
                                        <FcGoogle />
                                    </div>
                                </button>

                                <button
                                    onClick={() =>
                                        mostrarOcultarMensaje("Apple")
                                    }
                                    id="Apple"
                                >
                                    <div className="logoApple">
                                        <FaApple />
                                    </div>
                                </button>
                            </div>

                            {mostrarMensajeG && (
                                <MessageBoxGoogle
                                    message="¿Quieres descargar el archivo .csv para importarlo en Google Calendar?"
                                    onConfirm={() => {
                                        convertirYDescargarCSV();
                                        setMostrarMensajeG(false);
                                    }}
                                    onCancel={() => setMostrarMensajeG(false)}
                                />
                            )}

                            {mostrarMensajeA && (
                                <MessageBoxApple
                                    message="Para importar el horario a iOS Calendar debes importarlo a Google Calendar primero y sincronizar tus cuentas."
                                    onCancel={() => setMostrarMensajeA(false)}
                                />
                            )}
                        </div>
                        <Calendario
                            e={eventosFormateados}
                            startHour={dayjs("2024-02-17T08:00:00").toDate()}
                            endHour={dayjs("2024-02-17T20:00:00").toDate()}
                        />
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
}

export default CalendarioEscolar;
