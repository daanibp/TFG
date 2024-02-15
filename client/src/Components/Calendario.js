import React from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import "../estilos/Calendar.css";
import { CiCalendarDate } from "react-icons/ci";
import "dayjs/locale/es";

dayjs.Ls.en.weekStart = 1;
dayjs.locale("es");

function Calendario() {
    const localizer = dayjsLocalizer(dayjs);

    const events = [
        {
            start: dayjs("2024-02-14T12:00:00").toDate(),
            end: dayjs("2024-02-14T13:00:00").toDate(),
            title: "Evento 1",
            data: {
                x: 20,
            },
        },
    ];

    const components = {
        event: (props) => {
            const { data } = props.event;
            console.log(data);

            if (data.x > 15) {
                return (
                    <div className="event" style={{ background: "red" }}>
                        <CiCalendarDate />
                        {props.title}
                    </div>
                );
            }
            return (
                <div className="event">
                    <CiCalendarDate />
                    {props.title}
                </div>
            );
        },
    };

    return (
        <div className="Calendar">
            <Calendar
                localizer={localizer}
                events={events}
                formats={{
                    dayHeaderFormat: (date) => {
                        return dayjs(date).format("dddd @ DD/MM/YYYY");
                    },
                }}
                components={components}
                messages={{
                    next: "Siguiente",
                    previous: "Anterior",
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    date: "Fecha",
                    time: "Hora",
                    event: "Evento",
                }}
            />
        </div>
    );
}

export default Calendario;
