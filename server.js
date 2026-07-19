// Contenu de server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); 
app.use(express.json({ limit: '10mb' }));

app.post('/api/tryon', async (req, res) => {
  try {
    console.log("📥 Requête reçue sur Render !");
    const { person_image, garment_image } = req.body;
    const hfModelUrl = "https://api-inference.huggingface.co/models/levihsu/OOTDiffusion";
    const hfApiKey = "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"; 

    const response = await axios.post(hfModelUrl, {
      inputs: { image: person_image, cloth: garment_image }
    }, {
      headers: { 
        "Authorization": `Bearer ${hfApiKey}`, 
        "Content-Type": "application/json" 
      },
      responseType: 'arraybuffer'
    });

    const buffer = Buffer.from(response.data, 'binary');
    const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    
    console.log("✅ Image générée !");
    res.json({ result_image: base64Image });

  } catch (error) {
    const detailErreur = error.response && error.response.data 
      ? error.response.data.toString() 
      : error.message;
    console.error("❌ Erreur:", detailErreur);
    res.status(500).json({ error: "Échec de l'IA", details: detailErreur });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur prêt sur le port ${PORT}`));
