async function enviarDatos() {
    const datos = {
        'Edad': document.getElementById('edad').value,
        'Genero': document.getElementById('genero').value,
        'Peso (kg)': document.getElementById('peso').value,
        'Altura (cm)': document.getElementById('altura').value,
        'Frecuencia Cardiaca (lpm)': document.getElementById('frecuencia').value,
        'Nivel de Actividad (1-5)': document.getElementById('actividad').value,
        'Tiempo de Ejercicio (min)': document.getElementById('tiempo').value
    };

    const respuesta = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    
    const resultado = await respuesta.json();
    document.getElementById('resultado').textContent = `Resultado de la predicción: ${resultado.prediccion}`;
}