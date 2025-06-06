import React, { useState } from 'react'
import Formulario from '../components/Formulario';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/userService';


function Register() {

  const [formData, setFormData] = useState({ nombre:"",email: "", password: "", telefono: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const fields = [
    { nombre: "nombre", label: "Nombre", type: "text", placeholder: "Nombre", required: false },
    { nombre: "email", label: "Correo electrónico", type: "email", placeholder: "Correo", required: false },
    { nombre: "password", label: "Contraseña", type: "password", placeholder: "Contraseña", required: false },
    { nombre: "telefono", label: "Numero de telefono", type: "text", placeholder: "Numero de telefono", required: false },
    
  ];

  //VALIDACIONES
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let validationErrors = {};

    const nombre = formData.nombre;
    const email = formData.email;
    const password = formData.password;
    const telefono = formData.telefono;

   
    if (!nombre.trim()) {
      validationErrors.nombre = "El nombre es obligatorio";
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      validationErrors.email = "Correo inválido";
    }
    if (password.length < 6) {
      validationErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    if (!telefono.match(/^\+?[1-9]\d{1,14}$/)) {
      validationErrors.telefono = "Número de teléfono no válido";
    }

  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      
      // Llamar a la API para registrar al usuario
      await register( nombre, email, password, telefono ); 
  
      //Llevarlos al login despues de crear la cuenta correctamente
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
      titulo={"Registro"}
      campos={fields}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      buttonText="Registrarse"
      mensaje={<p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>}
      errors={errors}
      mostrarMedidorPassword={true}
      setErrors={setErrors}
      />
    </section>
    
  )
}

export default Register