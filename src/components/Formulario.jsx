import React, { useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';
import '../styles/Css/Formulario.css';

function Formulario({ campos, formData, setFormData, onSubmit, buttonText, mensaje, titulo }) {
  const { darkMode } = useContext(DarkModeContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section>
      <form className={`form-container ${darkMode ? 'dark-mode' : ''}`} onSubmit={onSubmit}>
        <h1 className='titulo'>{titulo}</h1>
        <section className='fondo'>
        {campos.map((campo) => (
        <section className="form-group" key={campo.nombre}>
          <label className='form-label'>{campo.label}</label>
            {campo.type === "select" ? (
              <select
                className='select-input'
                name={campo.nombre}
                value={formData[campo.nombre] || ""}
                onChange={handleChange}
                required={campo.required}
              >
                <option value="">Selecciona una opción</option>
                {campo.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className='form-input'
                type={campo.type}
                name={campo.nombre}
                value={formData[campo.nombre] || ""}
                onChange={handleChange}
                placeholder={campo.placeholder}
                required={campo.required}
              />
            )}
        </section>
        ))}
          <input className='form-button' type="submit" value={buttonText} />
        </section>
        <article className='mensaje'>
          {mensaje}
        </article>
      </form>
    </section>
  );
}

export default Formulario;