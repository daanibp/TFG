import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import "../estilos/Login.css";

function Login() {
    const [uo, setUo] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthState } = useContext(AuthContext);

    let navigate = useNavigate();

    const login = () => {
        const data = { uo: uo, password: password };
        axios
            .post("http://localhost:5001/usuarios/login", data)
            .then((response) => {
                if (response.data.error) {
                    alert(response.data.error);
                } else {
                    localStorage.setItem("accessToken", response.data.token);
                    setAuthState({
                        uo: response.data.uo,
                        id: response.data.id,
                        status: true,
                    });
                    navigate("/");
                }
            });
    };

    return (
        <div className="loginContainer">
            <label> UO: </label>
            <input
                type="text"
                onChange={(event) => {
                    setUo(event.target.value);
                }}
            />
            <label> Contraseña: </label>
            <input
                type="password"
                onChange={(event) => {
                    setPassword(event.target.value);
                }}
            />

            <button onClick={login}> Iniciar sesión </button>
        </div>
    );
}

export default Login;
