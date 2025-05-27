import API_URL from "../config/config";

// Función para iniciar sesión de usuario
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/usuario/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password} ),
    });

    
    if (!response.ok) throw new Error("Credenciales incorrectas");

    const datos = await response.json();

   
    localStorage.setItem("token", datos.token); // Guarda el token
    window.dispatchEvent(new Event("loginStatusChanged"));


    return datos; // Retorna el token y el usuario

  } catch (error) {
    console.error("Error en login: ", error.message);
    throw error;
  }

};

// Función para registrar un nuevo usuario
export const register = async (nombre, email, password, telefono) => {
    try {
      const response = await fetch(`${API_URL}/usuario/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({nombre, email, password, telefono}),
      });
   
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Error al registrar usuario");
      }
  
      return data;
    } catch (error) {
      console.error("Error en register: ", error.message);
      throw error;
    }
};

//Funcion para cerrar sesión
export const logout = () => {
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("loginStatusChanged"));
}

// Función para editar el perfil del usuario
export const editarPerfil  = async (id, nombre, email, password) => {
  
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token disponible");

  try{
    const response = await fetch(`${API_URL}/usuario/editar/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json",
                 Authorization: token},
      body: JSON.stringify({ nombre, email, password }),
    });

    const data = await response.json();

    if(!response.ok){
      throw new Error(data.error || "Error al editar perfil");
    }

    return data;

  }catch(error){
    console.error("Error en editarPerfil: ", error.message);
    throw error;
  }
}


export const getUser = async (id) => {
  try{
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/usuario/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });

    if(!response.ok) throw new Error("Error al obtener el usuario");

    const usuario = await response.json();
    return usuario;
  }catch(error){
    console.error("Error al obtener el usuario", error)
    throw error;
  }
}


export const deleteUser = async (id) => {

  try{
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/usuario/eliminar/${id}`, {
      method:"Delete",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });

    if(!response.ok){
      const errorData = await response.json(); // ⚠️ Si el backend devuelve HTML aquí fallará
      throw new Error(errorData.error || "No se pudo eliminar la cuenta");
    }

    const data = await response.json();

    return data
  }catch(error){
    console.error("Error en el service eliminando cuenta", error)
    throw error;
  }
}

export const contactar = async (nombre, email, mensaje) => {
  try {
    // Enviar el formulario al backend
    const response = await fetch(`${API_URL}/usuario/contacto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, nombre, mensaje }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al enviar el mensaje');
    }

    return data; // Retorna la respuesta del servidor
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
  }
}