import { useEffect, useState } from 'react';
import '../styles/Css/Carrusel.css'

const Carrusel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);  // Índice de la imagen actual que se muestra
  const [isPaused, setIsPaused] = useState(false); // Controla si la animación automática está pausada (por ejemplo, al hacer hover)
 
  useEffect(() => {
    
    if (!isPaused && images.length > 0) { // Si no está pausado y hay imágenes, cambiar automáticamente cada 3 segundos
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused, images]);

  // Función para pasar a la siguiente imagen manualmente
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  // Función para retroceder a la imagen anterior manualmente
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <section
      className="carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.length > 0 && (
        <>
          <section className="carousel-images" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {images.map((image, index) => (
              <img key={index} src={image} alt={`Slide ${index}`} />
            ))}
          </section>

          <button className="prev" onClick={handlePrev}>
            &#10094;
          </button>
          <button className="next" onClick={handleNext}>
            &#10095;
          </button>
        </>
      )}
    </section>
  );
};

export default Carrusel;
