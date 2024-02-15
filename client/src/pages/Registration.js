import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../estilos/Registration.css";

function Registration() {
    const initialValues = {
        uo: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        uo: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required(),
    });

    const onSubmit = (data) => {
        axios.post("http://localhost:5001/usuarios", data).then((response) => {
            console.log(data);
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
                </Form>
            </Formik>
        </div>
    );
}

export default Registration;
