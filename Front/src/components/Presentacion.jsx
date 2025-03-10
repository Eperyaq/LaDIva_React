import React, { useContext } from 'react'
import '../styles/Css/Presentacion.css'
import { DarkModeContext } from '../context/DarkModeContext';

function Presentacion({imagen, titulo, texto}) {

    const { darkMode } = useContext(DarkModeContext);

  return (
    <section className={`presentacion ${darkMode ? 'dark-mode' : ''}`}>
        <article className={`imagen ${darkMode ? 'dark-mode' : ''}`}>
            <img src={imagen} alt="Imagen de presentación" />
        </article>

        <article className={`texto ${darkMode ? 'dark-mode' : ''}`}>
            <h1>{titulo}</h1>
            {texto}
        </article>
    </section>
  )
}

export default Presentacion