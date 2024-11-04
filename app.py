from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os

app = Flask(__name__)
CORS(app)

# Cargar el modelo y el scaler previamente entrenados
model = joblib.load(os.path.join("model", "modelo_fatiga.pkl"))
scaler = joblib.load(os.path.join("model", "scaler.pkl"))

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json() 
    df = pd.DataFrame([data]) 

    # Preprocesamiento
    df['Genero'] = df['Genero'].map({'m': 0, 'f': 1}) 
    scaled_data = scaler.transform(df)  

    # Hacer la predicción
    prediccion = model.predict(scaled_data)
    resultado = "Fatiga" if prediccion[0] == 1 else "No Fatiga"
    return jsonify({'prediccion': resultado})

if __name__ == '__main__':
    app.run(debug=True)

