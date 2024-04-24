import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import Sidebar from "../Components/Sidebar";
import "../estilos/GestionCalendarios.css";
import { ProcesaExcelHorarios } from "../helpers/ProcesaExcelHorarios";

function GestionCalendarios() {
    const { authState } = useContext(AuthContext);

    const [solicitudes, setSolicitudes] = useState([]);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [usuarioSolicitante, setUsuarioSolicitante] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState("Todos");

    const [asignaturas, setAsignaturas] = useState([]);
    const [grupos, setGrupos] = useState([]);

    const [selectedScheduleFile, setSelectedScheduleFile] = useState(null);
    const [selectedExamFile, setSelectedExamFile] = useState(null);

    let gruposAux = [];

    // Función para obtener el ID de la asignatura
    const obtenerIdAsignatura = async (idAsignatura) => {
        try {
            const response = await axios.get(
                `http://localhost:5001/asignaturas/${idAsignatura}`
            );
            // Devuelve el ID de la asignatura si se encuentra en la base de datos
            return response.data.idAsignatura;
        } catch (error) {
            console.error("Error al obtener el ID de la asignatura:", error);
            return null;
        }
    };

    useEffect(() => {
        axios.get(`http://localhost:5001/solicitudEventos`).then((response) => {
            console.log("Solicitudes: ", response.data);
            setSolicitudes(response.data);
        });
        axios.get(`http://localhost:5001/asignaturas`).then((response) => {
            console.log("Asignaturas: ", response.data);
            setAsignaturas(response.data);
        });
        axios.get(`http://localhost:5001/grupos`).then((response) => {
            console.log("Grupos: ", response.data);
            setGrupos(response.data);
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

    // Función para determinar el cuatrimestre basado en el nombre del archivo
    function determinarCuatrimestre(nombreArchivo) {
        if (nombreArchivo.endsWith("2C.xlsx")) {
            return "C2";
        } else if (nombreArchivo.endsWith("1C.xlsx")) {
            return "C1";
        } else {
            // Si el nombre del archivo no termina en "1C" o "2C", puedes devolver un valor por defecto o lanzar un error
            throw new Error("El nombre del archivo no es válido");
        }
    }

    const handleScheduleFileUpload = async () => {
        return new Promise(async (resolve, reject) => {
            if (!selectedScheduleFile) {
                reject(new Error("No se seleccionó ningún archivo."));
                return;
            }

            console.log(
                "Archivo de horarios de clases seleccionado:",
                selectedScheduleFile
            );

            // Obtener el nombre del archivo
            const nombreArchivo = selectedScheduleFile.name;

            try {
                // Determinar el cuatrimestre basado en el nombre del archivo
                const cuatri = determinarCuatrimestre(nombreArchivo);

                // Procesar el archivo de horarios de clases
                await new Promise((resolve, reject) => {
                    ProcesaExcelHorarios(
                        selectedScheduleFile,
                        [
                            "1ITIN_A",
                            "1ITIN_B",
                            "2ITIN_A",
                            "2ITIN_ING",
                            "3ITIN_A",
                            "4ITIN_A",
                        ],
                        async (lineData) => {
                            try {
                                await handleAsignaturaProcessed(lineData);
                                handleGrupoProcessed(lineData);
                                resolve();
                            } catch (error) {
                                reject(error);
                            }
                        },
                        cuatri
                    );
                });

                // Resolver la promesa después de procesar el archivo
                resolve();
            } catch (error) {
                // Si ocurre un error, rechazar la promesa
                console.error("Error:", error.message);
                reject(error);
            }
        });
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

    const AgregarGrupos = async (grupos) => {
        console.log("Grupossss: ", grupos);
        try {
            await axios.post("http://localhost:5001/grupos/addGrupos", grupos);
            console.log("Los grupos se han agregado correctamente.");
        } catch (error) {
            console.error("Error al agregar grupos:", error);
        }
    };

    // Función para manejar los resultados del procesamiento de una línea del archivo Excel
    const handleLineProcessed = async (lineData) => {
        console.log("Datos de la línea procesada:", lineData);
        // CREAR EL EVENTO CON LOS DATOS PROCESADOS
        // para cada usuario que tenga lineData.Asignatura y pertenezca al grupo lineData.grupo se crea el evento

        // Crear las asignaturas si no están creadas
        await handleAsignaturaProcessed(lineData);
        // Crear los grupos para cada asignatura si no están creados
        await handleGrupoProcessed(lineData);
        // Añado grupos a la BBDD
        //await axios.post("http://localhost:5001/grupos/addGrupos", grupos);

        // Tras tener la asignatura y grupo chequeado de esta línea => se crea el evento

        // Recorremos los usuarios
        // Miramos si este usuario está matriculado en lineData.Asignatura y pertenece a lineData.grupo
        // Creamos el evento
    };

    // Función para cargar las asignaturas en la BBDD si no lo están
    const handleAsignaturaProcessed = async (lineData) => {
        // Verificar si ya existe una asignatura con el mismo id en la base de datos
        console.log("Datos de la línea procesada:", lineData);
        const asignaturaExistente = asignaturas.find(
            (asignatura) => asignatura.idAsignatura === lineData.id
        );

        if (asignaturaExistente) {
            console.log(
                "La asignatura " +
                    lineData.abr +
                    " ya existe en la base de datos."
            );
            // No hacer nada si la asignatura ya existe
        } else {
            console.log(
                "La asignatura " +
                    lineData.abr +
                    " no existe en la base de datos."
            );

            const nuevaAsignatura = {
                id: lineData.idNumerico,
                idAsignatura: lineData.id,
                nombreReal: lineData.nombre,
                nombreHorario: lineData.abr,
                nombreExamen: lineData.abr,
            };
            console.log("Nueva Asignatura: ", nuevaAsignatura);
            // Agregar la nueva asignatura al array de asignaturas
            asignaturas.push(nuevaAsignatura);
            // Añadirla a la base de datos
            await axios.post(
                "http://localhost:5001/asignaturas/addAsignatura",
                nuevaAsignatura
            );
        }
    };

    // Función para manejar la información de los grupos
    /*const handleGrupoProcessed = async (lineData) => {
        try {
            // Obtener el ID de la asignatura asociada al grupo
            const idAsignatura = await obtenerIdAsignatura(lineData.id);
            console.log("ID Asignatura: ", idAsignatura);

            // Verificar si ya existe un grupo con el mismo nombre en la base de datos
            const grupoExistente = grupos.find(
                (grupo) => grupo.nombre === lineData.grupo
            );
            if (!grupoExistente) {
                console.log(
                    "El grupo " +
                        lineData.grupo +
                        " no existe en la base de datos."
                );
                // Crear un nuevo objeto de grupo
                const nuevoGrupo = {
                    nombre: lineData.grupo,
                    tipo: getTipoGrupo(lineData.grupo),
                    AsignaturaId: idAsignatura,
                };
                console.log("Nuevo Grupo: ", nuevoGrupo);
                grupos.push(nuevoGrupo);
                // Añadir a la BBDD
                /*await axios.post(
                    "http://localhost:5001/grupos/addGrupo",
                    nuevoGrupo
                );
                // Actualizar la lista de grupos después de la creación del nuevo grupo
                const response = await axios.get(
                    "http://localhost:5001/grupos"
                );
                setGrupos(response.data);
                
            } else {
                console.log(
                    "El grupo " +
                        lineData.grupo +
                        " ya existe en la base de datos."
                );
            }
        } catch (error) {
            console.error("Error en el procesamiento de grupos:", error);
        }
    };*/

    const handleGrupoProcessed = (lineData) => {
        try {
            // Buscar la asignatura necesaria en la lista de asignaturas
            const asignatura = asignaturas.find(
                (asignatura) => asignatura.idAsignatura === lineData.id
            );

            console.log(asignatura);

            let idAsignatura = 0;
            if (asignatura) {
                // Obtener el ID de la asignatura
                idAsignatura = asignatura.id;
                console.log("ID asignatura: ", idAsignatura);
            } else {
                console.error("No se encontró la asignatura:", lineData.id);
            }

            const grupoExistente = grupos.find(
                (grupo) => grupo.nombre === lineData.grupo
            );
            if (!grupoExistente) {
                console.log(
                    "El grupo " +
                        lineData.grupo +
                        " no existe en la base de datos."
                );
                // Crear un nuevo objeto de grupo
                const nuevoGrupo = {
                    nombre: lineData.grupo,
                    tipo: getTipoGrupo(lineData.grupo),
                    AsignaturaId: idAsignatura,
                };
                console.log("Nuevo Grupo: ", nuevoGrupo);
                grupos.push(nuevoGrupo);
                gruposAux = [...gruposAux, gruposAux];
                /*const nuevosGrupos = [...grupos, nuevoGrupo];
                setGrupos(nuevosGrupos); // Actualizar el estado con la nueva copia*/
                console.log(
                    "Actualizacion grupos numero: ",
                    grupos.length,
                    grupos
                );
            } else {
                console.log(
                    "El grupo " +
                        lineData.grupo +
                        " ya existe en la base de datos."
                );
            }
        } catch (error) {
            console.error("Error al procesar los grupos:", error);
        }
    };

    // Función para obtener el tipo de grupo a partir del nombre del grupo
    const getTipoGrupo = (nombreGrupo) => {
        // Verificar si el nombre del grupo empieza por PL
        if (nombreGrupo.startsWith("PL")) {
            return "PL";
        }
        // Verificar si el nombre del grupo empieza por PA
        else if (nombreGrupo.startsWith("PA")) {
            return "PA";
        }
        // Verificar si el nombre del grupo empieza por TG
        else if (nombreGrupo.startsWith("TG")) {
            return "TG";
        }
        // Si no cumple ninguna de las condiciones anteriores, devolver "Teoría"
        else {
            return "Teoría";
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
                                    <button
                                        onClick={() =>
                                            handleScheduleFileUpload()
                                                .then(() => {
                                                    AgregarGrupos(grupos);
                                                })
                                                .catch((error) => {
                                                    console.error(
                                                        "Error al procesar el archivo de horarios:",
                                                        error
                                                    );
                                                })
                                        }
                                    >
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
                                    <button
                                        onClick={() => handleExamFileUpload()}
                                    >
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
