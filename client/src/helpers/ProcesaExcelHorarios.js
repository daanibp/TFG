import * as XLSX from "xlsx";

export function ProcesaExcelHorarios(file, hojasAProcesar, callback, cuatri) {
    const reader = new FileReader();

    reader.onload = async (event) => {
        const binaryString = event.target.result;
        const workbook = XLSX.read(binaryString, { type: "binary" });

        // Obtener los datos de la hoja "Asignaturas"
        const sheetAsignaturas = workbook.Sheets["Asignaturas"];
        const dataAsignaturas = XLSX.utils.sheet_to_json(sheetAsignaturas, {
            header: 1,
        });

        // Obtener los datos de la hoja "C1"
        const sheetC = workbook.Sheets[cuatri];
        const dataC = XLSX.utils.sheet_to_json(sheetC, {
            header: 1,
        });

        function obtenerFecha(numeroSemana, diaSemana) {
            return new Promise((resolve, reject) => {
                const diaColumna = {
                    Lunes: 1,
                    Martes: 2,
                    Miércoles: 3,
                    Jueves: 4,
                    Viernes: 5,
                };

                // Verificar si el día de la semana es válido
                if (!diaColumna.hasOwnProperty(diaSemana)) {
                    reject("Día de la semana inválido");
                }

                try {
                    // Buscar la fecha correspondiente en la tabla
                    for (let i = 1; i < dataC.length; i++) {
                        const row = dataC[i];
                        if (parseInt(row[0]) === numeroSemana) {
                            // Obtener la columna correspondiente al día de la semana
                            const columna = diaColumna[diaSemana];
                            // Verificar si hay una fecha en esa columna
                            if (row[columna]) {
                                const fechaNumeroSerie = row[columna];
                                const fechaJavaScript =
                                    XLSX.SSF.parse_date_code(fechaNumeroSerie); // Convertir el número de serie de fecha a fecha JavaScript
                                resolve(fechaJavaScript); // Resuelve la promesa con la fecha encontrada
                            } else {
                                reject(
                                    "FESTIVO: No hay fecha para el " +
                                        diaSemana +
                                        " de la semana especificado en la semana número " +
                                        numeroSemana
                                );
                            }
                        }
                    }
                    // Si no se encuentra la semana, rechaza la promesa
                    reject("No se encontró la semana número " + numeroSemana);
                } catch (error) {
                    // Manejar el error sin propagarlo hacia arriba
                    console.error("Error en obtenerFecha:", error);
                    // Puedes hacer algo aquí para manejar el error, como mostrar un mensaje de error o registrar el problema
                }
            });
        }

        // Función para buscar el nombre de la asignatura por código
        function obtenerNombreAsignatura(codigoAsignatura) {
            for (let i = 0; i < dataAsignaturas.length; i++) {
                const row = dataAsignaturas[i];
                if (row[0].endsWith(codigoAsignatura)) {
                    return { id: row[0], nombre: row[2] }; // Devolver el valor de la tercera columna (nombre de la asignatura)
                }
            }
            return "Asignatura no encontrada"; // Devolver un valor predeterminado si no se encuentra la asignatura
        }

        function devuelveDiaSemana(columna) {
            const diasSemana = [
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
            ];
            const indice = Math.floor((columna - 1) / 4);
            return diasSemana[indice];
        }

        function obtenerFechaLegible(fechaObjeto) {
            // Verificar si el objeto tiene los campos necesarios
            if (
                !fechaObjeto ||
                typeof fechaObjeto !== "object" ||
                isNaN(fechaObjeto.D) ||
                isNaN(fechaObjeto.m) ||
                isNaN(fechaObjeto.y)
            ) {
                return "Fecha inválida";
            }

            // Obtener el día, mes y año del objeto
            const dia = fechaObjeto.d;
            const mes = fechaObjeto.m;
            const año = fechaObjeto.y;

            // Formatear la fecha en un formato legible "d/m/y"
            const fechaLegible = `${dia}/${mes}/${año}`;

            return fechaLegible;
        }

        // Iterar sobre las hojas especificadas
        hojasAProcesar.forEach((hoja) => {
            const sheet = workbook.Sheets[hoja];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Iterar sobre cada fila de datos a partir de la fila 4
            for (let rowIndex = 3; rowIndex < data.length; rowIndex++) {
                const row = data[rowIndex];

                if (!row[0]) {
                    continue;
                }

                // Iterar sobre las columnas correspondientes a cada día de la semana
                for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
                    const columnaInicio = 1 + columnIndex * 4;

                    // Obtener la información relevante para el evento de este día de la semana
                    console.log(row[columnaInicio]);
                    const asignatura = obtenerNombreAsignatura(
                        row[columnaInicio]
                    );
                    const id = asignatura.id;
                    const nombre = asignatura.nombre;
                    const abr = row[columnaInicio];
                    const aula = row[columnaInicio + 2];
                    const grupo = row[columnaInicio + 1] + "-" + abr;

                    console.log(
                        "Valor de las semanas: ",
                        row[columnaInicio + 3]
                    );

                    let semanas = row[columnaInicio + 3];

                    if (typeof semanas !== "undefined") {
                        if (
                            row[columnaInicio + 3] === "TODAS" &&
                            cuatri === "C1"
                        ) {
                            semanas = [
                                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
                            ];
                        } else if (
                            row[columnaInicio + 3] === "TODAS" &&
                            cuatri === "C2"
                        ) {
                            semanas = [
                                20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                                32, 33, 34, 35,
                            ];
                        } else if (semanas.length === 0) {
                            semanas = [];
                        } else if (semanas.length > 2) {
                            semanas = semanas.split(",").map(Number);
                        } else {
                            semanas = [Number(semanas)];
                        }
                    } else {
                        semanas = [];
                    }
                    console.log("Semanas:", semanas, typeof semanas);

                    const horaInicioFin = row[0];
                    const horaComienzo = horaInicioFin.slice(0, 5) + ":00"; // Extraer y agregar ":00" al final
                    const horaFinal = horaInicioFin.slice(6) + ":00"; // Extraer y agregar ":00" al final

                    // Crear un evento para cada fecha de cada semana
                    if (typeof semanas !== "string") {
                        // Crear un array de promesas para cada fecha de cada semana
                        const promises = semanas.map((semana) => {
                            return new Promise((resolve, reject) => {
                                obtenerFecha(
                                    semana,
                                    devuelveDiaSemana(columnaInicio)
                                )
                                    .then((fecha) => {
                                        const fechaLegible =
                                            obtenerFechaLegible(fecha);
                                        resolve({
                                            id,
                                            nombre,
                                            abr,
                                            aula,
                                            grupo,
                                            horaComienzo,
                                            horaFinal,
                                            fecha: fechaLegible,
                                        });
                                    })
                                    .catch((error) => {
                                        console.error(
                                            "Error obteniendo fecha:",
                                            error
                                        );
                                        console.log(
                                            "Datos: (" + nombre,
                                            aula,
                                            grupo + ")"
                                        );
                                        reject(error);
                                    });
                            });
                        });

                        // Esperar a que todas las promesas se resuelvan
                        Promise.all(promises)
                            .then((results) => {
                                // Llamar a la función de devolución de llamada para procesar los eventos
                                results.forEach((result) => {
                                    if (result !== null) {
                                        callback(result);
                                    }
                                });
                            })
                            .catch((error) => {
                                console.error("Error obteniendo fecha:", error);
                                console.log(
                                    "Datos: (" + nombre,
                                    aula,
                                    grupo + ")"
                                );
                            });
                    }
                }
            }
        });
    };

    reader.readAsBinaryString(file);
}

/*export function CargarAsignaturas(file, callback) {
    const reader = new FileReader();

    reader.onload = async (event) => {
        const binaryString = event.target.result;
        const workbook = XLSX.read(binaryString, { type: "binary" });

        // Obtener los datos de la hoja "Asignaturas"
        const sheetAsignaturas = workbook.Sheets["Asignaturas"];
        const dataAsignaturas = obtenerDatosDesdeFila(sheetAsignaturas, 3);

        // Llamar a la función de devolución de llamada con los datos obtenidos
        callback(dataAsignaturas);
    };
    reader.readAsBinaryString(file);
}

function obtenerUltimaParte(string, separador) {
    const partes = string.split(separador);
    return partes[partes.length - 1];
}

function obtenerDatosDesdeFila(sheet, filaInicio) {
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const datos = [];
    for (let rowIndex = filaInicio - 1; rowIndex < data.length; rowIndex++) {
        const row = data[rowIndex];
        // Verificar si la fila tiene al menos dos columnas
        if (row.length >= 2) {
            // Guardar los valores de la primera y segunda columna
            datos.push({
                id: row[0],
                abr: obtenerUltimaParte(row[0], "-"),
                nombreReal: row[2],
            });
        }
    }
    return datos;
}*/
