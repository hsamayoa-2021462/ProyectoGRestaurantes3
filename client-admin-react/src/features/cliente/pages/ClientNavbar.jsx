import React, { useState } from 'react';

const ClientNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="client-navbar">
            <div className="sidebar-brand">Gastro</div>

            {/* Botón de hamburguesa */}
            <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Menú con clase dinámica */}
            <div className={`client-nav-links ${isOpen ? 'open' : ''}`}>
                <a href="/inicio">Inicio</a>
                <a href="/menu">Menú</a>
                <a href="/pedidos">Mis Pedidos</a>
                <a href="/reservaciones">Reservaciones</a>
            </div>
        </nav>
    );
};