// backend/server.js
import express from 'express';
import userRoutes from './routes/userRoutes.js';

const app = express();
app.use(express.json());

// Ajoutez vos routes ici
app.use('/api/users', userRoutes);

// Démarrez le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
