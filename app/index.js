const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Configuration pour capturer correctement l'IP derrière un proxy
app.set('trust proxy', true);

// Middleware de logging pour toutes les requêtes API
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Capturer la réponse originale
  const originalSend = res.send;
  let statusCode = 200;
  
  res.send = function(data) {
    statusCode = res.statusCode;
    
    // Créer le log
    const timestamp = new Date().toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                    req.headers['x-forwarded-for'] || 'IP inconnue';
    
    const method = req.method;
    const url = req.originalUrl || req.url;
    const queryParams = Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : 'Aucun';
    const responseTime = Date.now() - startTime;
    
    // Préparer la réponse pour le log (limiter la taille)
    let responseData = '';
    try {
      if (data) {
        const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
        // Limiter la réponse à 500 caractères pour éviter des logs trop volumineux
        responseData = dataStr.length > 500 ? dataStr.substring(0, 500) + '...[tronqué]' : dataStr;
      } else {
        responseData = 'Vide';
      }
    } catch (e) {
      responseData = '[Erreur de sérialisation]';
    }
    
    // Format du log lisible
    const logEntry = `${timestamp} | IP: ${clientIP} | ${method} ${url} | Statut: ${statusCode} | Paramètres: ${queryParams} | Temps: ${responseTime}ms | Réponse: ${responseData}\n`;
    
    // Écrire dans le fichier de log
    const logPath = path.join(__dirname, 'logs', 'api.log');
    fs.appendFile(logPath, logEntry, (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture du log:', err);
      }
    });
    
    // Appeler la méthode send originale
    originalSend.call(this, data);
  };
  
  next();
});

const client = new MongoClient(process.env.MONGODB_URI);

async function main() {
  await client.connect();
  const db = client.db();

  // Vulnerable endpoint
  app.get("/reviews", async (req, res) => {
    let q = req.query.id;
    try {
      q = JSON.parse(q);
      const reviews = await db.collection("reviews").find(q).toArray();
      res.json(reviews);
    } catch (e) {
      const reviews = await db.collection("reviews").find({ _id: new ObjectId(q) }).toArray();
      res.json(reviews);
    }
  });

  // Secure endpoint
  app.get("/reviews/safe", async (req, res) => {
    const reviewId = req.query.id;
    const reviews = await db.collection("reviews").find({ _id: new ObjectId(reviewId) }).toArray();
    res.json(reviews);
  });

  // Completely secure endpoint - no error leakage
  app.get("/reviews/safe/v2", async (req, res) => {
    const reviewId = req.query.id;
    
    // Validate that id is a valid ObjectId string
    if (!reviewId || typeof reviewId !== 'string' || !ObjectId.isValid(reviewId)) {
      return res.json([]);
    }
    
    try {
      const reviews = await db.collection("reviews").find({ _id: new ObjectId(reviewId) }).toArray();
      res.json(reviews);
    } catch (e) {
      res.json([]);
    }
  });

  app.listen(3000, () => console.log("Listening on port 3000"));
}

main().catch(console.error);
