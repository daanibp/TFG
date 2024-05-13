import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../helpers/AuthContext";
import Sidebar from "../Components/Sidebar";
import "../estilos/AsignarGrupos.css";

function AsignarGrupos() {
    const { authState } = useContext(AuthContext);

    const [selectedFile, setSelectedFile] = useState(null);

    // Función para manejar el cambio en el archivo seleccionado
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
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
                                Asignación de Grupos
                            </div>
                        </div>
                        <div className="boxGrupos">
                            <div className="TituloGrupos">
                                <h1>Grupos</h1>
                            </div>

                            <div className="CargarFicheroGrupos">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                />
                                <button>Cargar Grupos de los Alumnos</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
}

export default AsignarGrupos;
