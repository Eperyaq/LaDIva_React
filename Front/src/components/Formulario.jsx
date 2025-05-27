import React, { useContext, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import MedidorPassword from "./MedidorPassword";
import { Eye, EyeOff } from "lucide-react";
import "../styles/Css/Formulario.css";

function Formulario({ campos, formData, setFormData, onSubmit, buttonText, mensaje, textoInicial, titulo, errors, mostrarMedidorPassword, setShowModal }) {
  const { darkMode } = useContext(DarkModeContext);
  const [showPassword, setShowPassword] = useState(false);
  const [ terminoAceptado, setTerminoAceptado ] = useState(false);


 
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] }); // Guardamos el archivo temporalmente
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const aceptarTerminos = () => {
    setTerminoAceptado(!terminoAceptado)
  }

  const abrirModal = () => {
    setShowModal(true)
  }

  return (
    <section>
      <form
        className={`form-container ${darkMode ? "dark-mode" : ""}`}
        onSubmit={onSubmit}
        encType="multipart/form-data"
      >
        <h1 className="titulo">{titulo}</h1>
        {textoInicial && <h2 className="texto-inicial">{textoInicial}</h2>}

        <section className="fondo">
          {campos.map((campo) => (
            campo.type === "checkbox" ? (
              <section key={campo.nombre} className="form-group">
                <label className="form__checkbox-label">
                  <input
                    type="checkbox"
                    name={campo.nombre}
                    required={campo.required}
                    checked={ terminoAceptado || false}
                    onChange={aceptarTerminos}
                  />
                  {/* Si es checkbox de términos, renderizamos texto y botón para abrir modal */}
                  {campo.nombre === "terminos" ? (
                    <>
                      {campo.label.split("términos")[0]}
                      <input
                        type="button"
                        className="form__link-button"
                        onClick={abrirModal}
                        value={"Términos y condiciones"}
                        
                      />
                    </>
                  ) : (
                    campo.label
                  )}
                </label>
                {errors?.[campo.nombre] && (
                  <p className="error-message">{errors[campo.nombre]}</p>
                )}
              </section>
            ) : (
              <section key={campo.nombre} className="form-group">
                <label className="form-label">{campo.label}</label>

                <section className="input-container">
                  {/* Si es select, renderizamos un <select> con sus opciones */}
                  {campo.type === "select" ? (
                    <select
                      className="select-input"
                      name={campo.nombre}
                      value={formData[campo.nombre] || ""}
                      onChange={handleChange}
                      required={campo.required}
                    >
                      <option value="">Seleccione una opción</option>
                      {campo.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : campo.type === "file" ? (
                    <input
                      className="form-input"
                      type="file"
                      name={campo.nombre}
                      accept="image/*"
                      onChange={handleChange}
                      required={campo.required}
                    />
                  ) : (
                    <input
                      className={`form-input ${errors?.[campo.nombre] ? "input-error" : ""}`}
                      type={
                        campo.type === "password" && showPassword
                          ? "text"
                          : campo.type
                      }
                      name={campo.nombre}
                      value={formData[campo.nombre] || ""}
                      onChange={handleChange}
                      placeholder={campo.placeholder}
                      required={campo.required}
                    />
                  )}
                  
                  {/* Botón para mostrar/ocultar password con iconos */}
                  {campo.type === "password" && (
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  )}
                </section>

                {campo.nombre === "password" && mostrarMedidorPassword && (
                  <MedidorPassword password={formData.password} />
                )}

                {errors?.[campo.nombre] && (
                  <p className="error-message">{errors[campo.nombre]}</p>
                )}
              </section>
            )
          ))}

          {errors?.general && <p className="error-message">{errors.general}</p>}

          <input className="form-button" type="submit" value={buttonText} />
          <article className="mensaje">{mensaje}</article>
        </section>
      </form>
    </section>

  );
}

export default Formulario;
