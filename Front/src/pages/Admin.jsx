import React, { useContext, useState } from 'react'
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom';
import Formulario from '../components/Formulario'
import '../styles/Css/Admin.css'

function Admin() {
  const { isAdmin } = useContext(UserContext);
  const navigate = useNavigate();
  const [ textoInicial, setTextoInicial ] = useState("");
  const [errors, setErrors] = useState(""); //En este caso me renta que sea un string porque solo voy a mostrar un error a la vez
  const [ showModal, setShowModal] = useState(false);


  if(!isAdmin){
    navigate('/'); // Redirige al inicio si no es admin
  } 

  // INFO CITA PIERCING

  const [formDataPiercing, setFormDataPiercing] = useState({ piercing: "", fecha: "", notas: "",  terminos:"" });  
    
  const fieldsPiercing = [
    { nombre: "fecha", label: "Mejor disponibilidad", type: "text", placeholder: "Indica una fecha ", required: true, },

    {
      nombre: "piercing",
      label: "¿Que piercing quieres?",
      type: "select",
      options: [
        { value: "Oreja", label: "Oreja (Lóbulo, Helix...) - 10 euros de señal" },
        { value: "Cara", label: "Cara (Ceja, Septum...) - 10 euros de señal" },
        { value: "Cuerpo", label: "Cuerpo (Ombligo, Pezón...) - 10 euros de señal" }
      ],
      required: true
    },
    { nombre: "observaciones", label: "Notas (Opcional) ", type: "text", placeholder: "Notas adicionales", required: false, },
    { nombre: "terminos", label: "He leido y acepto los terminos y condiciones", type: "checkbox", required: true }
  ];

  const handleSubmitPiercing = async (e) => {
      e.preventDefault();
      try {
        const response = await crearCita( formData, "piercing"); //Lo mismo, se le pasa el tipo de cita porque siempre va a ser la misma
  
        if (response.error){
          throw new Error("Ha habido un error al crear la cita.");
        }else {
          setTextoInicial("Cita reservada con éxito, te llegará un correo con la confirmación");
          setFormData({piercing: "", fecha: "", notas: ""}); // Resetear el formulario
        }
      } catch (error) {
        setMensaje(error.message);
      }
    };



  //INFO CITAS TATUAJES

  const [nuevoFormData, setNuevoFormData] = useState({ fecha: "", diseno: "", archivo:"", servicio: "tatuaje", observaciones:"", terminos:"" });
   const fieldsTattoo = [
    { nombre: "fecha", label: "Mejor disponibilidad", type: "string", placeholder: "Selecciona una fecha", required: false}, 
    { nombre: "diseno", label: "¿Qué te quieres tatuar?", type: "textarea", placeholder: "Describe tu diseño", required: true },
    { nombre: "observaciones", label: "Notas (Opcional)", type: "textarea", placeholder: "Notas adicionales", required: false },
    { nombre: "archivo", label: "Pon tu diseño (Opcional)", type: "file", required: false },
    { nombre: "terminos", label: "He leido y acepto los terminos y condiciones", type: "checkbox", required: true }
  ];
  
  
  const handleSubmitTatoo = async (e) => {
      e.preventDefault();
    
      let validationErrors = {};
    
      const { fecha, diseno, observaciones, archivo } = nuevoFormData;
    
      // Validaciones
      if (!fecha) {
        validationErrors.fecha = "La fecha es obligatoria";
      }
      if (!diseno.trim()) {
        validationErrors.diseno = "El diseño es obligatorio";
      }
    
      if (archivo && archivo.size > 5 * 1024 * 1024) { // Limitar a 5MB
        validationErrors.archivo = "El archivo es demasiado grande. Máximo 5MB.";
      }
      if (observaciones && observaciones.length > 500) { // Limitar a 500 caracteres
        validationErrors.notas = "Las notas son demasiado largas. Máximo 500 caracteres.";
      }
    
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return false;
      }
    
      try {
        // Si hay un archivo, subirlo a Cloudinary
        if (archivo) {
          const data = new FormData();
          data.append("file", archivo); // Aquí se agrega el archivo
          data.append("upload_preset", "tatuajes_upload");
    
          const res = await fetch("https://api.cloudinary.com/v1_1/dqmbt7gvm/image/upload", {
            method: "POST",
            body: data,
          });
    
          const file = await res.json();
          
          // Guardamos la URL en el estado
          const urlFoto = file.secure_url;
    
          // Actualizamos nuevoFormData con la URL de la imagen 
          const updatedFormData = { ...nuevoFormData, archivo: urlFoto }; // Usamos la URL en lugar del archivo
    
          // Ahora enviamos los datos al servidor
          const subirCitaTattoo = await crearCita(updatedFormData, "tatuaje");
    
          if (subirCitaTattoo.error) {
            setErrors({ general: subirCitaTattoo.error });
          } else {
            setErrors({}); // Limpiar errores si la cita se creó correctamente
            setTextoInicial("Cita de tatuaje reservada con éxito, te llegará un correo con la confirmación");
            setNuevoFormData({ fecha: "", diseno: "", archivo: null, servicio: "tatuaje", observaciones: "", terminos: false }); // Resetear el formulario
          }
  
        } else {
          // Si no hay archivo, simplemente enviar el formData sin cambios
          const subirCitaTattoo = await crearCita(nuevoFormData, "tatuaje");
    
          if (subirCitaTattoo.error) {
            setErrors({ general: subirCitaTattoo.error });
          } else {
            setErrors({}); // Limpiar errores si la cita se creó correctamente
            setTextoInicial("Cita de tatuaje reservada con éxito, te llegará un correo con la confirmación");
            setNuevoFormData({ fecha: "", diseno: "", archivo: null, servicio: "tatuaje", observaciones: "", terminos: false }); // Resetear el formulario
          }
        }
      } catch (error) {
        console.error("Error al crear la cita:", error);
        setErrors({ general: "Error al crear la cita. Inténtalo de nuevo." });
      }
    };


  return (
    <section className="citas-container">
      <h1>TODAS LAS CITAS</h1>

      <section className="citas-grid">

        <article className="cita-card">
              <Formulario
            titulo="Reserva tu cita para tatuarte"
            campos={fieldsTattoo}
            formData={nuevoFormData}
            setFormData={setNuevoFormData}
            onSubmit={handleSubmitTatoo}
            buttonText="Reservar Cita"
            mensaje={textoInicial}
            errors={errors} // Pasar los errores al formulario
            setShowModal={setShowModal}
          />
          {
            showModal && (
              <ModalTerminos show={showModal} onClose = {() => setShowModal(false)} />
            )
          }
        </article>

        
        <article className="cita-card">
          <Formulario 
            titulo="Reserva cita Piercing"
            textoInicial={textoInicial}
            campos={fieldsPiercing}
            formData={formDataPiercing}
            setFormData={setFormDataPiercing}
            onSubmit={handleSubmitPiercing}
            errors={errors}
            buttonText="Reservar Cita"
          />
        </article>

      </section>
    </section>
  )
}

export default Admin


      

