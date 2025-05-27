import React, { useContext } from 'react'
import otros from '../assets/images/otros/otros.js'
import Carrusel from '../components/Carrusel.jsx'
import yani from '../assets/images/tattos_Yani/yani.js';
import piercing from '../assets/images/piercings/piercings.js'
import alex from '../assets/images/tattoos_Alex/alex.js'
import { Link } from 'react-router-dom';
import Separador from '../components/Separador.jsx';
import Resenia from '../components/Resenia.jsx';
import '../styles/Css/Home.css'
import { DarkModeContext } from '../context/DarkModeContext.jsx';


function Home({logged}) {

  const {darkMode} = useContext(DarkModeContext);

  const tattooImages = [
    yani.batman,
    alex.runa,
    alex.memento
  ];
  
  const piercingImagesList = [
    piercing.entre_pechos,
    piercing.oreja,
    piercing.septum2
  ];

  return (
    <section>

      <section className='info'>
        <article>
          <video src={otros.video}  autoPlay muted loop className='video' />
        </article>

        <article className='texto'>
          <h1 className='titulo'><b>LA DIVA TATTOO, EL NUEVO ESTUDIO DE TATUAJES EN LANZAROTE QUE MARCARÁ TENDENCIA.</b></h1>

          <p className='parrafo'>
            La Diva Tattoo, en Lanzarote, es un estudio donde transformamos ideas en arte personalizado. 
            Nuestro equipo de tatuadores combina experiencia, técnicas modernas y creatividad para ofrecer tatuajes únicos
            en estilos variados, adaptados a cada cliente.
          </p>

          <p className='parrafo'>
            También ofrecemos servicios como piercings, micropigmentación y gemas dentales, siempre con los más altos
            estándares de calidad y seguridad. En un espacio que une profesionalismo, arte y comodidad, 
            hacemos de cada diseño una historia inolvidable.
          </p>
          
        </article>
      </section>


      <Separador text={"Servicios"} />


      <section className={`muestras ${darkMode ? 'dark-mode' : ''}`} >

        <article className='abajo'>
          <h1>Tatuajes</h1>
          <Carrusel images={tattooImages} />
          <p>Esta es tu oportunidad de convertir tus ideas en arte eterno.
            Dale vida a tu historia sobre tu piel, porque un tatuaje es más que un diseño,
            es un reflejo de quién eres. ¿Te atreves?</p>
          <Link to={(logged ? '/citaTattoo' : '/login') } className='btn'>Pedir cita tatuajes</Link>
        </article>
        
        <article className='abajo'>
          <h1>Piercings</h1>
          <Carrusel images={piercingImagesList} />
          <p>Un piercing es más que un accesorio, es una declaración de estilo y actitud. Esta es tu oportunidad de brillar con algo único y auténtico. ¡Hazlo tuyo!</p>
          <Link to={(logged ? '/citaPiercing' : '/login') } className='btn'>Pedir cita piercing</Link>
        </article>
        
        
      </section>

      <section className={`reseñas ${darkMode ? 'dark-mode' : ''}`}>
        
        <h1>Reseñas</h1>
        
        <section className='reseña-section'>

          <Resenia 
          nombre='Lucia Garcia Muñoz' 
          cuerpo='Me hice un tatuaje lineal el día 6 de septiembre en este elegante y bonito estudio.
          La experiencia allí fue inigualable ya que el trato y el cuidado fueron espectaculares.
          Una gran profesional, muy recomendable 😊' 
          />
          


          <Resenia 
          nombre='Lidia Miguez' 
          cuerpo='El trato fue muy bueno desde que contacté con ellos por redes y por parte de todos.
          El resultado de los tatuajes es excelente, es fiel al diseño que le pedimos.' 
          />


          <Resenia 
          nombre='Hakuna Matata' 
          cuerpo='Hoy lo conocimos y hoy mismo nos convertimos en clientas.
          Super recomendable 👌🏻
          Trato amable, super limpio todo sin duda volveremos.
          Gracias Diva tatto ❣️' 
          />

          <Resenia 
          nombre='Javier Melian' 
          cuerpo='Muy recomendado, la chica pelirroja de la entrada un encanto de niña incluso me ayudó a terminar de decidirme,
          un trato super especial tanto de la tatuadora como de la chica de puerta increíble 
          y un tatuaje q todos los días seguiré mirando jejejejej muchas gracias de verdad volveré sin lugar a dudas.' 
          />

          <Resenia 
          nombre='Alicia Noda' 
          cuerpo='Como siempre impecable su servicio.
          La atención personalizada ,la paciencia y el tiempo que toma con cada uno de sus diseños.
          Ya he ido varias veces,y sin ninguna duda seguiré.
          Super recomendado ❤️' 
          />

        </section>
        
      </section>


    </section>
    
  )
}

export default Home;