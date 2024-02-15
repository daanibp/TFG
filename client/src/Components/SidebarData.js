import React from "react";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export const SidebarData = ({ id }) => [
    {
        title: "Mi calendario",
        icon: <CalendarMonthIcon />,
        childrens: [
            {
                title: "Mi calendario escolar",
                icon: <SchoolIcon />,
                link: `/calendarioescolar/${id}`,
            },
            {
                title: "Mi calendario completo",
                icon: <CalendarMonthIcon />,
                link: "/calendariocompleto",
            },
        ],
    },
];
