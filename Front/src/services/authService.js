import API_URL from "../config/config";

export const verifyEmail = async (email, codigo) => {
  const response = await fetch(`${API_URL}/usuario/verificar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, codigo })
  });

  if (!response.ok) throw new Error("Código incorrecto");

  if(response.ok){
    const datos = await response.json();
    console.log("Token recibido:", datos.token); // Verifica si llega el token

    
    localStorage.setItem("token", datos.token); // Guarda el token
    window.dispatchEvent(new Event("loginStatusChanged"));

    return datos;
  }
  
};
