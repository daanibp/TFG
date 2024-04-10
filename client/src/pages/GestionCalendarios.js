import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import Sidebar from "../Components/Sidebar";
import "../estilos/GestionCalendarios.css";

function GestionCalendarios() {
    const { authState } = useContext(AuthContext);

    const [solicitudes, setSolicitudes] = useState([]);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [usuarioSolicitante, setUsuarioSolicitante] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState("Todos");

    const [selectedScheduleFile, setSelectedScheduleFile] = useState(null);
    const [selectedExamFile, setSelectedExamFile] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5001/solicitudEventos`).then((response) => {
            console.log("Solicitudes: ", response.data);
            setSolicitudes(response.data);
        });
    }, []);

    const showSolicitudDetails = (solicitud) => {
        axios
            .get(`http://localhost:5001/usuarios/${solicitud.UsuarioId}`)
            .then((response) => {
                setUsuarioSolicitante(response.data.uo);
            })
            .catch((error) => {
                console.error("Error al obtener el nombre de usuario:", error);
            });
        setSelectedSolicitud(solicitud);
    };

    const closeSolicitudDetails = () => {
        setSelectedSolicitud(null);
    };

    const aceptarSolicitud = (solicitud) => {
        // Actualizo solicitud en la BBDD
        axios.put(
            `http://localhost:5001/solicitudEventos/aceptar/${solicitud.id}`
        );
        window.location.reload();
        // Se crea el evento global
        const globalEventData = {
            asunto: solicitud.asunto,
            fechaDeComienzo: solicitud.fechaDeComienzo,
            comienzo: solicitud.comienzo,
            fechaDeFinalización: solicitud.fechaDeFinalización,
            finalización: solicitud.finalización,
            todoElDía: solicitud.todoElDía,
            reminder: solicitud.reminder,
            reminderDate: solicitud.reminderDate,
            reminderTime: solicitud.reminderTime,
            meetingOrganizer: solicitud.meetingOrganizer,
            description: solicitud.description,
            priority: solicitud.priority,
            private: solicitud.private,
            sensitivity: solicitud.sensitivity,
            showTimeAs: solicitud.showTimeAs,
            solicitudEventoId: solicitud.id,
        };
        axios.post(
            "http://localhost:5001/eventosglobales/addGlobalEvent",
            globalEventData
        );
    };

    const denegarSolicitud = (solicitud) => {
        // Actualizo solicitud en la BBDD
        axios.put(
            `http://localhost:5001/solicitudEventos/denegar/${solicitud.id}`
        );
        window.location.reload();
    };

    // Función para manejar el cambio en el archivo seleccionado para horarios de clases
    const handleScheduleFileChange = (event) => {
        setSelectedScheduleFile(event.target.files[0]);
    };

    // Función para manejar el cambio en el archivo seleccionado para exámenes
    const handleExamFileChange = (event) => {
        setSelectedExamFile(event.target.files[0]);
    };

    // Función para manejar la subida del archivo de horarios de clases
    const handleScheduleFileUpload = () => {
        if (selectedScheduleFile) {
            console.log(
                "Archivo de horarios de clases seleccionado:",
                selectedScheduleFile
            );
            // Enviar el archivo al servidor para su procesamiento
        } else {
            alert(
                "Por favor selecciona un archivo de horarios de clases antes de subirlo."
            );
        }
    };

    // Función para manejar la subida del archivo de exámenes
    const handleExamFileUpload = () => {
        if (selectedExamFile) {
            console.log("Archivo de exámenes seleccionado:", selectedExamFile);
            // Enviar el archivo al servidor para su procesamiento
        } else {
            alert(
                "Por favor selecciona un archivo de exámenes antes de subirlo."
            );
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return "";

        const parts = timeString.split(":");

        if (parts.length !== 3) return "";

        const hours = parseInt(parts[0], 10).toString();
        const minutes = parts[1];

        return `${hours}:${minutes}`;
    };

    // Función para filtrar las solicitudes por estado
    const filtrarSolicitudes = (estado) => {
        setFiltroEstado(estado);
    };

    const getButtonStyle = (estado) => {
        return filtroEstado === estado ? "button-active" : "";
    };

    const solicitudesFiltradas = solicitudes.filter((solicitud) => {
        if (filtroEstado === "Todos") return true;
        return solicitud.estado === filtroEstado;
    });

    return (
        <AuthContext.Provider value={{ authState }}>
            {!authState.status ? (
                <div className="container">
                    <h1 className="title">Mi Área Personal</h1>
                    <h3 className="subtitle">
                        Inicia sesión para acceder a tu área personal
                    </h3>
                </div>
            ) : (
                <div className="sidebar-calendar">
                    <div id="miSidebar">
                        <Sidebar id={authState.id} isAdmin={authState.admin} />
                    </div>
                    <div className="box">
                        <div className="boxTitleLabel">
                            <div className="titleLabel">
                                Gestión de Calendarios
                            </div>
                        </div>
                        <div className="containerGestion">
                            <div className="boxEventos">
                                <div className="Titulo">
                                    <h1>Eventos</h1>
                                </div>

                                <div className="CargarClases">
                                    Cargar horario de clases
                                </div>
                                <div className="CargarFichero">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleScheduleFileChange}
                                    />
                                    <button onClick={handleScheduleFileUpload}>
                                        Cargar horarios de clases
                                    </button>
                                </div>

                                <div className="GenerarExamenes">
                                    Cargar calendario de exámenes
                                </div>
                                <div className="CargarFichero">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleExamFileChange}
                                    />
                                    <button onClick={handleExamFileUpload}>
                                        Cargar calendario de exámenes
                                    </button>
                                </div>
                            </div>

                            <div className="boxEventosGlobales">
                                <div className="Titulo">
                                    <h1>Eventos Globales</h1>
                                </div>
                                <div className="GestionarSolicitudes">
                                    Gestionar solicitudes
                                    <div>
                                        <button
                                            className={getButtonStyle("Todos")}
                                            onClick={() =>
                                                filtrarSolicitudes("Todos")
                                            }
                                        >
                                            Todas
                                        </button>
                                        <button
                                            className={getButtonStyle(
                                                "Pendiente"
                                            )}
                                            onClick={() =>
                                                filtrarSolicitudes("Pendiente")
                                            }
                                        >
                                            Pendientes
                                        </button>
                                        <button
                                            className={getButtonStyle(
                                                "Aceptada"
                                            )}
                                            onClick={() =>
                                                filtrarSolicitudes("Aceptada")
                                            }
                                        >
                                            Aceptadas
                                        </button>

                                        <button
                                            className={getButtonStyle(
                                                "Denegada"
                                            )}
                                            onClick={() =>
                                                filtrarSolicitudes("Denegada")
                                            }
                                        >
                                            Denegadas
                                        </button>
                                    </div>
                                </div>
                                <div className="boxSolicitudes">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Asunto</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {solicitudesFiltradas.map(
                                                (solicitud) => (
                                                    <tr key={solicitud.id}>
                                                        <td>{solicitud.id}</td>
                                                        <td>
                                                            {solicitud.asunto}
                                                            <button
                                                                className="botonDetalles"
                                                                onClick={() =>
                                                                    showSolicitudDetails(
                                                                        solicitud
                                                                    )
                                                                }
                                                            >
                                                                Ver más detalles
                                                            </button>
                                                        </td>
                                                        <td>
                                                            {solicitud.estado}
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="botonAceptar"
                                                                onClick={() =>
                                                                    aceptarSolicitud(
                                                                        solicitud
                                                                    )
                                                                }
                                                            >
                                                                +
                                                            </button>
                                                            <button
                                                                className="botonDenegar"
                                                                onClick={() =>
                                                                    denegarSolicitud(
                                                                        solicitud
                                                                    )
                                                                }
                                                            >
                                                                -
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {selectedSolicitud && (
                                <div className="solicitudDetails">
                                    <h2>Detalles de la solicitud</h2>
                                    <p>ID: {selectedSolicitud.id}</p>
                                    <p>Estado: {selectedSolicitud.estado}</p>
                                    <p>Asunto: {selectedSolicitud.asunto}</p>
                                    <p>
                                        Fecha de Comienzo:{" "}
                                        {new Date(
                                            selectedSolicitud.fechaDeComienzo
                                        ).toLocaleDateString()}
                                    </p>
                                    <p>
                                        Hora de Comienzo:{" "}
                                        {formatTime(selectedSolicitud.comienzo)}
                                    </p>
                                    <p>
                                        Fecha de Finalización:{" "}
                                        {new Date(
                                            selectedSolicitud.fechaDeFinalización
                                        ).toLocaleDateString()}
                                    </p>
                                    <p>
                                        Hora de Finalización:{" "}
                                        {formatTime(
                                            selectedSolicitud.finalización
                                        )}
                                    </p>
                                    <p>
                                        Descripción:{" "}
                                        {selectedSolicitud.description}
                                    </p>
                                    <p>Solicitado por: {usuarioSolicitante}</p>
                                    <button onClick={closeSolicitudDetails}>
                                        Cerrar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
}

export default GestionCalendarios;
