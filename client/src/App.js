import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { AuthContext } from "./helpers/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import PageNotFound from "./pages/PageNotFound";
import Calendar from "./pages/CalendarioEscolar";

function App() {
    const [authState, setAuthState] = useState({
        uo: "",
        id: 0,
        status: false,
    });

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
                        status: true,
                    });
                }
            });
    }, [setAuthState]);

    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthState({
            uo: "",
            id: 0,
            status: false,
        });
    };

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
                            path="/calendarioescolar"
                            element={<Calendar />}
                        />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </Router>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
