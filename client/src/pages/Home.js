import React, { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import "../estilos/Home.css";
import Sidebar from "../Components/Sidebar";
//import Sidebarv2 from "../Components/Sidebar_v2";

function Home() {
    const { authState } = useContext(AuthContext);

    console.log("AuthState", authState);

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
                <div>
                    <Sidebar id={authState.id} isAdmin={authState.admin} />
                </div>
            )}
        </AuthContext.Provider>
    );
}

export default Home;
