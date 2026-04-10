export const getWeather = async () => {
  try {
    // Coordenadas de Santiago, Chile
    const lat = -33.45;
    const lon = -70.67;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener clima');
    
    const data = await response.json();
    return data.current;
  } catch (error) {
    console.error("Error Weather API:", error);
    return null;
  }
};

// Función para traducir el "weather_code" a texto humano
export const getWeatherStatus = (code) => {
  const codes = {
    0: 'Despejado',
    1: 'Mayormente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    61: 'Lluvia ligera',
    71: 'Nieve ligera',
    95: 'Tormenta eléctrica'
  };
  return codes[code] || 'Condición desconocida';
};