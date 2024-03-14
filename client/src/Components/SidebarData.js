import React from "react";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { RiAdminFill, RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { RiAdminLine } from "react-icons/ri";
import { FaCalendarPlus } from "react-icons/fa6";
import { AiOutlineGlobal } from "react-icons/ai";

export const SidebarData = ({ id }) => [
    {
        title: "Mi calendario",
        icon: <CalendarMonthIcon />,
        iconClosed: <RiArrowDownSFill />,
        iconOpened: <RiArrowUpSFill />,
        childrens: [
            {
                title: "Mi calendario escolar",
                icon: <SchoolIcon />,
                link: `/calendar/calendarioescolar/${id}`,
            },
            {
                title: "Calendario Global",
                icon: <AiOutlineGlobal />,
                link: "/calendar/calendarioglobal",
            },
        ],
        visible: "true",
    },
    {
        title: "Administración",
        icon: <RiAdminFill />,
        iconClosed: <RiArrowDownSFill />,
        iconOpened: <RiArrowUpSFill />,
        childrens: [
            {
                title: "Crear administradores",
                icon: <RiAdminLine />,
                link: `/admin/crearadmin`,
            },
            {
                title: "Gestionar calendarios",
                icon: <FaCalendarPlus />,
                link: "/admin/gestioncalendarios",
            },
        ],
        visible: "false",
    },
];
