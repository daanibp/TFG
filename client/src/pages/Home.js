import React, { useContext, useState } from "react";
import { AuthContext } from "../helpers/AuthContext";
import "../estilos/Home.css";
import Sidebar from "../Components/Sidebar";

function Home() {
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
                <Sidebar />
            )}
        </AuthContext.Provider>
    );
}

export default Home;
