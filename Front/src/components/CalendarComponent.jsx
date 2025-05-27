import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { es } from 'date-fns/locale';
import { getAllCitasConfirmadas } from '../services/citasConfirmadasService';
import CalendarToolbar from './CalendarToolbar';
import '../styles/Css/Calendario.css'

const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CalendarComponent(newEvent) {
  const [events, setEvents] = useState([]);
  const [filtroServicio, setFiltroServicio] = useState("todos");

  const eventosFiltrados = filtroServicio === "todos" ? events : events.filter(event => event.servicio === filtroServicio);

   useEffect(() => {

    const obtenerCitasConfirmadas = async () => {
      const token = localStorage.getItem('token');
      const todasCitas = await getAllCitasConfirmadas(token); //Cojo todas las citas
    
      // Ahora las mapeo metiendo bien los formatos de hora que si no, no se pueden usar en el calendario
      const eventos = todasCitas.map(cita => {
        const inicio = new Date(`${cita.fechaAsignada}T${cita.horaInicio}`);
        const fin = new Date(`${cita.fechaAsignada}T${cita.horaFin}`);
        const artista = cita.artista; // Obtener el artista de la cita
    
        // Verifica si las fechas son válidas
        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
          console.error("Fecha inválida para la cita", cita);
          return null; 
        }

        return {
          title: `Cita con ${cita.Citum.Usuario.nombre} - Artista a cargo: ${artista}`,
          start: inicio,
          end: fin,
          servicio: cita.servicio,
        };
        
      });
    
      
      // Filtra los eventos nulos (aquellos con fechas inválidas)
      const eventosFiltrados = eventos.filter(evento => evento !== null);
    
      setEvents(eventosFiltrados);
    };
    
    obtenerCitasConfirmadas();
  }, [newEvent]);
  
  return (
    <section className="calendar-component">
      <section className="calendar-wrapper">

      <select onChange={(e) => setFiltroServicio(e.target.value)} className='select-servicio'>
        <option value="todos">Todos</option>
        <option value="tatuaje">Tatuaje</option>
        <option value="piercing">Piercing</option>
        
      </select>

        <Calendar
          localizer={localizer}
          events={eventosFiltrados}
          startAccessor="start"
          endAccessor="end"
          min={new Date(1970, 1, 1, 10, 0)}
          max={new Date(1970, 1, 1, 23, 0)}
          components={{
            toolbar: CalendarToolbar,
          }}
          eventPropGetter={(event) => {
            let backgroundColor = '';
            switch (event.servicio) {
              case 'tatuaje':
                backgroundColor = '#749E39'; // Verde
                break;
              case 'piercing':
                backgroundColor = '#2563eb'; // azul
                break;
              default:
                backgroundColor = '#6b7280'; // gris para otros
            }

            return {
              style: {
                backgroundColor,
                borderRadius: '6px',
                color: 'white',
                border: 'none',
                padding: '4px',
              },
            };
          }}
          style={{ height: 600 }}
          messages={{
            next: "Sig.",
            previous: "Ant.",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            date: "Fecha",
            time: "Hora",
            event: "Evento"
          }}
        />
      </section>
    </section>
  );
}

export default CalendarComponent;
