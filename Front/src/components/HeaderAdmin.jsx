import React, { useContext, useEffect, useState } from 'react';
import iconos from '../assets/images/iconos/Iconos.js'
import "../styles/Css/Header.css";
import { Link } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext.jsx';
import Switch from './Switch.jsx';


function HeaderAdmin() {
    const [logged, setLogged] = useState(!!localStorage.getItem("token"));
    const { darkMode, toggleTheme } = useContext(DarkModeContext);
    const [menuOpen, setMenuOpen] = useState(false); // Estado para el menú

    const closeMenu = () => setMenuOpen(false);
    
    //Comprueba si esta logged o no.
    useEffect(() => {
        const updateLoginStatus = () => {
            setLogged(!!localStorage.getItem("token"));
        };

        window.addEventListener("loginStatusChanged", updateLoginStatus);
        return () => window.removeEventListener("loginStatusChanged", updateLoginStatus);
    }, []);
    
    return (
        <header className={darkMode ? "dark" : ""}>
            <article className="logo-container">
                <Link to='/'>
                    <img src={darkMode ? iconos.logo : iconos.logo_oscuro} alt="Logo de la diva" className={`logo ${darkMode ? "dark" : ""}`} />
                </Link>
                {/* Botón de menú hamburguesa */}
                
                <img src={iconos.menu} alt="menu hamburguesa" className={`menu ${darkMode ? "dark" : ""}`} onClick={() => setMenuOpen(!menuOpen)} />
                
            </article>
            
            {/* Menú de navegación */}
            <nav className={menuOpen ? "open" : ""}>
             
                <ul>
                    <li>
                        <Switch darkMode={darkMode} toggleTheme={toggleTheme} />
                    </li>
                    {menuOpen && <li className="navbar"><Link to="/" onClick={closeMenu}>Inicio</Link></li>} {/* Solo se muestra con el menú abierto*/}

                    <li className={`navbar ${darkMode ? "dark" : ""}`}><Link to="/sobreNosotros" onClick={closeMenu}>Sobre Nosotros </Link></li>

                    {/* <li className={`navbar ${darkMode ? "dark" : ""}`}> <Link to="/admin" onClick={closeMenu}> Todas las citas</Link></li> */}
                    
                    <li className={`navbar ${darkMode ? "dark" : ""}`}> <Link to="/citasAdmin" onClick={closeMenu}> Citas Pendientes</Link></li>

                    <li className={`navbar ${darkMode ? "dark" : ""}`}><Link to={logged ? "/perfil" : "/login"} onClick={closeMenu}> {logged ? "Perfil" : "Iniciar sesión"} </Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default HeaderAdmin;
