import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
import joblib

data = pd.read_csv('data/fatigue_data_100.csv')

data['Resultado (Fatiga: Si/No)'] = data['Resultado (Fatiga: Si/No)'].map({'Si': 1, 'No': 0})
data['Genero'] = data['Genero'].str.strip().str.lower()
data['Genero'] = data['Genero'].map({'m': 0, 'f': 1})

# Definir características y etiquetas
X = data[['Edad', 'Genero', 'Peso (kg)', 'Altura (cm)', 'Frecuencia Cardiaca (lpm)', 'Nivel de Actividad (1-5)', 'Tiempo de Ejercicio (min)', 'Indice de Fatiga (0-10)']]
y = data['Resultado (Fatiga: Si/No)']

# Dividir en conjuntos de entrenamiento y pruebas
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Normalizar las características
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Inicializar y entrenar el modelo
model = LogisticRegression()
model.fit(X_train, y_train)

# Hacer predicciones
y_pred = model.predict(X_test)

# Calcular precisión
accuracy = accuracy_score(y_test, y_pred)
print(f'Precisión del modelo: {accuracy:.2f}')

nuevo_dato = {
    'Edad': [30],
    'Genero': ['m'],
    'Peso (kg)': [70],
    'Altura (cm)': [175],
    'Frecuencia Cardiaca (lpm)': [101],
    'Nivel de Actividad (1-5)': [3],
    'Tiempo de Ejercicio (min)': [50],
    'Indice de Fatiga (0-10)': [7]
}

nuevo_dato_df = pd.DataFrame(nuevo_dato)
nuevo_dato_df['Genero'] = nuevo_dato_df['Genero'].map({'m': 0, 'f': 1})
nuevo_dato_normalizado = scaler.transform(nuevo_dato_df)
prediccion = model.predict(nuevo_dato_normalizado)

resultado = "Fatiga" if prediccion[0] == 1 else "No Fatiga"
print(f'Resultado de la predicción: {resultado}')

joblib.dump(scaler, 'model/scaler.pkl')
joblib.dump(model, 'model/modelo_fatiga.pkl')


