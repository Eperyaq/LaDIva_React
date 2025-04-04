import React, { useContext } from 'react'
import '../styles/Css/GaleriaTatuajes.css'
import { DarkModeContext } from '../context/DarkModeContext';

function GaleriaTatuajes({images}) {

  const {darkMode} = useContext(DarkModeContext);

  return (
    <section className={`fondo ${darkMode ? "dark" : ""}`}>
      <section className="tattoo-gallery">
        {images.map((image, index) => (
          <section key={index} className="tattoo-item">
            <img src={`http://localhost:4000/api/upload/${image}`} alt={`Imagen ${index + 1}`} />
          </section>
        ))}
      </section>
    </section>
    
  );
};

export default GaleriaTatuajes