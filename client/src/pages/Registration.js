import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../estilos/Registration.css";
import { useNavigate } from "react-router-dom";

function Registration() {
    const initialValues = {
        uo: "",
        password: "",
    };
    let navigate = useNavigate();

    const [registroExitoso, setRegistroExitoso] = useState(false);

    const validationSchema = Yup.object().shape({
        uo: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required(),
    });

    const onSubmit = (data) => {
        axios.post("http://localhost:5001/usuarios", data).then((response) => {
            console.log(data);
            setRegistroExitoso(true);
        });
    };

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <label>UO: </label>
                    <ErrorMessage name="uo" component="span" />
                    <Field
                        id="inputCreatePost"
                        name="uo"
                        placeholder="(Ex. UO111111...)"
                    />
                    <label>Contraseña: </label>
                    <ErrorMessage name="password" component="span" />
                    <Field
                        type="password"
                        id="inputCreatePost"
                        name="password"
                        placeholder="Tu contraseña..."
                    />
                    <button className="buttonRegistration" type="submit">
                        Registrarse
                    </button>

                    {registroExitoso && (
                        <div className="mensaje">
                            <p>Te has registrado correctamente. ¡Bienvenido!</p>
                            <button onClick={() => navigate("/login")}>
                                Iniciar Sesión
                            </button>
                        </div>
                    )}
                </Form>
            </Formik>
        </div>
    );
}

export default Registration;
