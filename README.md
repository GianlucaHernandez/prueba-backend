# App Seguimiento de Habitos

Esta es una APP desarrollada con Express.js y MongoDB, que permitirá a los usuarios gestionar hábitos.
El usuario podrá crear su cuenta, iniciar sesión, agregar hábitos y marcarlos como
completados cada día. Si el usuario no marca el hábito en un día, el conteo se reiniciará.
Una barra de progreso cambiará de rojo a verde a medida que el usuario se acerque a
los 66 días.

## Tecnologías utilizadas:
Node.js
Express.js
MongoDB (Atlas)
Mongoose
Dotenv
Cors
Gestor de paquetes npm

## Herramienta utilizada para probar endpoints

Postman

## Pasos para su ejecucion
Necesitamos acceder a la terminal e ir a la ruta donde esta guardado nuestro proyecto, ingresar en terminal.

1. Para iniciar el programa establecer conexion y conectar base de datos.
- npm start 
2. El servidor estara corriendo en
-http://localhost:3000

## Endpoints disponibles
3. Crear un habito
- metodo: Post
- URL: /habit
- Json: {
    "title":"",
    "description":""
}

4. Eliminar habito
- metodo: Delete
- URL: /habit/:id

5. Modificar habito
- metodo: Put
- URL: /habit/:id
- json: {
    "title":"",
    "description":""
}

## Gianluca Hernandez
## 24002037
