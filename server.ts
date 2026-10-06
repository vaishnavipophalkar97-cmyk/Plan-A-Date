import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { searchPlacesNearLocation } from './server/serpApi.js';
import { composeItineraryWithGemma } from './server/gemmaComposer.js';
import { QuestionnaireState } from './src/types/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// API: System Status and Capabilities
app.get('/api/status', (req, res) => {
  const gemmaConfigured = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
  const serpApiConfigured = !!process.env.SERPAPI_KEY && process.env.SERPAPI_KEY !== 'MY_SERPAPI_KEY';

  res.json({
    appName: 'Plan A Date',
    version: '1.0.0',
    philosophy: 'Plan → Go Outside → Experience → Remember',
    gemmaConfigured,
    serpApiConfigured,
    modelName: process.env.GEMMA_MODEL || 'Gemma 2 / Gemini (Open-Weight Architecture)',
    mode: gemmaConfigured && serpApiConfigured ? 'live_production' : 'high_fidelity_demo',
  });
});

// API: Place Discovery
app.post('/api/places-search', async (req, res) => {
  try {
    const { locationName, lat, lng, activities, radiusKm } = req.body;
    const result = await searchPlacesNearLocation({
      locationName: locationName || 'Bengaluru',
      lat: typeof lat === 'number' ? lat : 12.9716,
      lng: typeof lng === 'number' ? lng : 77.5946,
      activities: Array.isArray(activities) ? activities : ['Cafés', 'Nature'],
      radiusKm: typeof radiusKm === 'number' ? radiusKm : 5,
    });
    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/places-search:', err);
    res.status(500).json({ error: 'Failed to search places', details: err.message });
  }
});

// API: Generate Itinerary with Gemma Reasoning Layer
app.post('/api/generate-itinerary', async (req, res) => {
  try {
    const questionnaire: QuestionnaireState = req.body.questionnaire;
    if (!questionnaire) {
      return res.status(400).json({ error: 'Missing questionnaire data' });
    }

    // Step 1: Discover real places
    const radiusNumber = questionnaire.distance === 'Within 2 km' ? 2 : questionnaire.distance === 'Within 5 km' ? 5 : questionnaire.distance === 'Within 10 km' ? 10 : 20;

    const { candidates, source } = await searchPlacesNearLocation({
      locationName: questionnaire.location.name,
      lat: questionnaire.location.lat,
      lng: questionnaire.location.lng,
      activities: questionnaire.activities,
      radiusKm: radiusNumber,
    });

    // Step 2: Use Gemma to reason, filter, and compose into structured itinerary
    const itinerary = await composeItineraryWithGemma(questionnaire, candidates);
    itinerary.isDemoMode = source !== 'serpapi' || !process.env.GEMINI_API_KEY;

    res.json({ itinerary, candidateCount: candidates.length, discoverySource: source });
  } catch (err: any) {
    console.error('Error generating itinerary:', err);
    res.status(500).json({ error: 'Failed to generate itinerary', details: err.message });
  }
});

// API: Refine Itinerary ("Make it more...")
app.post('/api/refine-itinerary', async (req, res) => {
  try {
    const { questionnaire, refinement } = req.body;
    if (!questionnaire || !refinement) {
      return res.status(400).json({ error: 'Missing questionnaire or refinement modifier' });
    }

    const radiusNumber = questionnaire.distance === 'Within 2 km' ? 2 : questionnaire.distance === 'Within 5 km' ? 5 : 10;
    const { candidates, source } = await searchPlacesNearLocation({
      locationName: questionnaire.location.name,
      lat: questionnaire.location.lat,
      lng: questionnaire.location.lng,
      activities: questionnaire.activities,
      radiusKm: radiusNumber,
    });

    const refinedPlan = await composeItineraryWithGemma(questionnaire, candidates, refinement);
    refinedPlan.isDemoMode = source !== 'serpapi' || !process.env.GEMINI_API_KEY;

    res.json({ itinerary: refinedPlan });
  } catch (err: any) {
    console.error('Error refining itinerary:', err);
    res.status(500).json({ error: 'Failed to refine itinerary', details: err.message });
  }
});

async function startServer() {
  if (!isProd) {
    // In development mode, mount Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, port },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Plan A Date server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
