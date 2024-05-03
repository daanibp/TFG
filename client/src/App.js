import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { AuthContext } from "./helpers/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import PageNotFound from "./pages/PageNotFound";
import CalendarioEscolar from "./pages/CalendarioEscolar";
import CalendarioGlobal from "./pages/CalendarioGlobal";
import LoadingIndicator from "./Components/LoadingIndicator";
import AdminRegistration from "./pages/AdminRegistration";
import GestionCalendarios from "./pages/GestionCalendarios";
import GestionMatriculas from "./pages/GestionMatriculas";
import RealizarMatricula from "./pages/RealizarMatricula";

function App() {
    const [authState, setAuthState] = useState({
        uo: "",
        id: 0,
        admin: false,
        status: false,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("http://localhost:5001/usuarios/auth", {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            })
            .then((response) => {
                if (response.data.error) {
                    setAuthState((prevAuthState) => ({
                        ...prevAuthState,
                        status: false,
                    }));
                } else {
                    setAuthState({
                        uo: response.data.uo,
                        id: response.data.id,
                        admin: response.data.admin,
                        status: true,
                    });
                }
                setLoading(false);
            });
    }, [setAuthState]);

    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthState({
            uo: "",
            id: 0,
            admin: false,
            status: false,
        });
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <div className="App">
            <AuthContext.Provider value={{ authState, setAuthState }}>
                <Router>
                    <div className="navigation">
                        <div className="brand">
                            <Link to="/">Mi Área Personal</Link>
                        </div>
                        <div className="login-registration">
                            {!authState.status ? (
                                <div>
                                    <Link to="/login">Iniciar sesión</Link>
                                    <Link to="/registration">Regístrate</Link>
                                </div>
                            ) : (
                                <div className="user-info">
                                    <div className="user-info-container">
                                        <h1>{authState.uo}</h1>
                                    </div>
                                    {authState.status && (
                                        <button
                                            className="logout-btn"
                                            onClick={logout}
                                        >
                                            Cerrar sesión
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/registration"
                            element={<Registration />}
                        />
                        <Route
                            path="/calendar/calendarioescolar/:id"
                            element={<CalendarioEscolar />}
                        />
                        <Route
                            path="/calendar/calendarioglobal"
                            element={<CalendarioGlobal />}
                        />
                        <Route
                            path="/matriculas/realizarmatricula"
                            element={<RealizarMatricula />}
                        />
                        <Route
                            path="/admin/crearadmin"
                            element={<AdminRegistration />}
                        />
                        <Route
                            path="/admin/gestioncalendarios"
                            element={<GestionCalendarios />}
                        />
                        <Route
                            path="/admin/gestionmatriculas"
                            element={<GestionMatriculas />}
                        />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </Router>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
