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

    try {
        // Solicitud para obtener el resultado de predicción
        const respuesta = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        const resultado = await respuesta.json();
        document.getElementById('resultado').textContent = `Resultado de la predicción: ${resultado.prediccion}`;

        // Solicitud para obtener la probabilidad de fatiga
        const probabilidad = await fetch('http://127.0.0.1:5000/predict_probabilidad', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const porcentaje = await probabilidad.json();
        
        // Calcular y actualizar el nivel de fatiga en porcentaje
        const probabilidadFatiga = porcentaje.probabilidad_fatiga;
        const porcentajeFatiga = (probabilidadFatiga * 100).toFixed(2);

        const progressBar = document.getElementById("progress-bar");
        progressBar.style.width = `${porcentajeFatiga}%`;

        // Actualizar el texto del nivel de fatiga
        const fatigueLevelText = document.getElementById("fatigue-level-text");
        fatigueLevelText.textContent = probabilidadFatiga >= 0.5
            ? "Alerta: Nivel preocupante de fatiga detectado"
            : "Nivel de fatiga dentro de límites normales";

        if (probabilidadFatiga >= 0.7) {
            progressBar.style.backgroundColor = "red";
        } else if (probabilidadFatiga >= 0.4) {
            progressBar.style.backgroundColor = "orange";
        } else {
            progressBar.style.backgroundColor = "green";
        } 
        
        // ícono y recomendaciones
        let mensajeRecomendacion = "";
        let iconoRecomendacion = "";
        if (porcentajeFatiga <= 40) {
            mensajeRecomendacion = "Nivel de fatiga óptimo: continúe sin preocupaciones.";
            iconoRecomendacion = '<i class="fas fa-smile" style="color: green;"></i>';
        } else if (porcentajeFatiga <= 70) {
            mensajeRecomendacion = "Nivel de fatiga moderado: considere una pausa.";
            iconoRecomendacion = '<i class="fas fa-meh" style="color: orange;"></i>';
        } else {
            mensajeRecomendacion = "Nivel de fatiga alto: se recomienda descanso de 10 minutos.";
            iconoRecomendacion = '<i class="fas fa-tired" style="color: red;"></i>';
        }
        
        document.getElementById("recomendacion-texto").textContent = mensajeRecomendacion;
        document.getElementById("recomendacion-icono").innerHTML = iconoRecomendacion;

        // contenedor circular
        const tiempoEjercicio = datos["Tiempo de Ejercicio (min)"];
        const objetivo = 80;
        const progreso = Math.min((tiempoEjercicio / objetivo) * 100, 100).toFixed(1);

        // Actualizar el marcador circular
        const marcador = document.querySelector(".marcador-circular");
        marcador.style.background = `conic-gradient(#FA7E61 ${progreso * 3.6}deg, #F5EFED ${progreso * 3.6}deg)`;

        // Actualizar el texto de porcentaje en el centro del marcador
        const textoPorcentaje = document.getElementById("porcentaje-texto");
        textoPorcentaje.textContent = `${progreso}%`;

    } catch (error) {
        console.error("Error en la solicitud:", error);
        document.getElementById('resultado').textContent = "Error en la solicitud, intente nuevamente.";
    }   
}


