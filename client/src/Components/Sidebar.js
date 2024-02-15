import React, { useState } from "react";
import "../estilos/Sidebar.css";
import { SidebarData } from "./SidebarData.js";

function Sidebar({ id }) {
    const [activeItem, setActiveItem] = useState(null);

    const handleItemClick = (index) => {
        setActiveItem(activeItem === index ? null : index);
    };

    return (
        <div className="Sidebar">
            <div className="titleAreaPersonalSideBar">Mi Área Personal</div>
            <div>
                <hr></hr>
            </div>
            <ul className="SidebarList">
                {SidebarData({ id }).map((val, index) => (
                    <li
                        key={index}
                        className={`row ${
                            activeItem === index ? "active" : ""
                        }`}
                        onClick={() => handleItemClick(index)}
                    >
                        <div id="icon">{val.icon}</div>
                        <div id="title">{val.title}</div>
                        {val.childrens && activeItem === index && (
                            <ul className="SubmenuList">
                                {val.childrens.map((child, childIndex) => (
                                    <li
                                        key={childIndex}
                                        onClick={() =>
                                            (window.location.pathname =
                                                child.link)
                                        }
                                    >
                                        <div id="icon">{child.icon}</div>
                                        <div id="title">{child.title}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;
