import React, { useEffect, useState } from 'react'
import Formulario from '../components/Formulario'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { editarPerfil } from '../services/userService';


function EditarPerfil() {

    const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });
    const [errors, setErrors] = useState({}); 
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    const fields = [
        { nombre: "nombre", label: "Nombre", type: "text", placeholder: "Nuevo nombre", required: false },
        { nombre: "email", label: "Correo electrónico", type: "email", placeholder: "Nuevo correo", required: false },
        { nombre: "password", label: "Contraseña", type: "password", placeholder: "Nueva contraseña", required: false }
      ];

      useEffect(() => {
        // Obtener ID del usuario desde el token
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setUserId(decoded.id); 
        }
      }, []);

      const handleSubmit = async (e) => {
          e.preventDefault();
          
          let validationErrors = {};
      
          const nombre = formData.nombre;
          const email = formData.email;
          const password = formData.password;
        
          if (!nombre.trim()) {
            validationErrors.nombre = "El nombre es obligatorio";
          }
          if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            validationErrors.email = "Correo inválido";
          }
          if (password.length < 6) {
            validationErrors.password = "La contraseña debe tener al menos 6 caracteres";
          }
        
          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
          }
        
          try {
            
            await editarPerfil( userId,nombre, email, password ); 
        
            //Llevarlos a verificar en dos pasos despues de crear la cuenta correctamente
            navigate("/verificar");
        
          } catch (error) {
            console.error("Error en el registro:", error);
            
            // Mostrar el error del backend en el front
            setErrors({ general: error.message || "Error al registrarse" });
          }
        };

  return (
    <section>
      <Formulario
        titulo={"Editar Perfil"}
        campos={fields}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        buttonText={"Editar"}
        errors={errors}
        mostrarMedidorPassword={true}
        setErrors={setErrors}
      />
    </section>
    
  )
}

export default EditarPerfil