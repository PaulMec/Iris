const express = require('express'); 
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Rutas
app.use('/todos', todoRoutes);
app.use('/auth', authRoutes);

// Ruta raíz para verificar si el servidor está corriendo
app.get('/', (req, res) => {
  res.send('¡Hola, Node.js está funcionando!');
});

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });
