import React, { useContext } from "react";
import Calendario from "../Components/Calendario";
import Sidebar from "../Components/Sidebar";
import { AuthContext } from "../helpers/AuthContext";
import { FaGoogle } from "react-icons/fa";
import { FaApple } from "react-icons/fa";

function CalendarioEscolar() {
    const { authState } = useContext(AuthContext);

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
                        <Sidebar />
                    </div>
                    <div className="box">
                        <div className="boxTitleLabel">
                            <div className="titleLabel">
                                Mi Calendario Escolar
                            </div>
                        </div>
                        <div className="opcionesBotones">
                            <button id="HorarioDeClases">
                                <div className="txtHorCl">
                                    Horario de Clases
                                </div>
                            </button>
                            <button id="HorarioDeExamenes">
                                <div className="txtHorEx">
                                    Horario de Exámenes
                                </div>
                            </button>
                            <button id="Google">
                                <div className="logoGoogle">
                                    <FaGoogle />
                                </div>
                            </button>
                            <button id="Apple">
                                <div className="logoApple">
                                    <FaApple />
                                </div>
                            </button>
                        </div>
                        <Calendario />
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
}

export default CalendarioEscolar;
