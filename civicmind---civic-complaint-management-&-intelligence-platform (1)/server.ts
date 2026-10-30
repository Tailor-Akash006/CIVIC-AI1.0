import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const isProduction =
  process.env.NODE_ENV === 'production' ||
  process.env.npm_lifecycle_event === 'start' ||
  Boolean(process.env.K_SERVICE);

const port = isProduction ? (Number(process.env.PORT) || 8080) : 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenAI | null = null;
if (apiKey) {
  genAI = new GoogleGenAI({ apiKey });
}

// Fallback response generator if API key is not supplied or model quota exceeded
function getDomainFallbackResponse(userMessage: string): string {
  const q = userMessage.toLowerCase();

  if (q.includes('pothole') || q.includes('road') || q.includes('report') || q.includes('how to report') || q.includes('file')) {
    return `### How to Report a Civic Issue in CIVICMIND:
1. Click **"Report Issue"** in the top navigation or head to \`/report\`.
2. Enter a clear description of the defect (e.g., *pothole depth, exact road name, water leakage*).
3. Select the appropriate civic category (*Roads & Potholes, Water & Sewage, Street Lighting, Sanitation, or Traffic*).
4. Tap the **interactive map** to pinpoint the exact GPS coordinates and ward.
5. Upload an image if available—our AI automatically analyzes the photo to verify damage severity.
6. Submit to receive an instant **Tracking ID** (e.g., \`CM-2026-9041\`) and real-time SLA tracker.`;
  }

  if (q.includes('priority') || q.includes('score') || q.includes('rank') || q.includes('calculate')) {
    return `### How CIVICMIND Calculates AI Priority Scores:
CIVICMIND computes a transparent score from **0 to 100** based on 4 objective dimensions:
- **Public Safety Risk (40%)**: Immediate physical hazards (deep craters, open sewer manholes, exposed live wires).
- **Critical Facility Proximity (25%)**: Proximity to schools, emergency hospital routes, and transit hubs.
- **Corroborating Reports (20%)**: Upvoted or repeated reports from multiple citizens in the same 250m radius.
- **Infrastructure Vulnerability (15%)**: History of repetitive failures in that municipal ward.

**SLA Tiers:**
- **Critical (Score 85+)**: Dispatched under 4 hours
- **High (Score 65–84)**: Dispatched under 24 hours
- **Medium (Score 40–64)**: Scheduled under 48 hours
- **Low (Score <40)**: Routine maintenance within 5 days`;
  }

  if (q.includes('duplicate') || q.includes('merge') || q.includes('cluster')) {
    return `### Duplicate Detection & Clustering:
When multiple residents report the same problem (e.g., 5 neighbors reporting a burst water pipe):
- CIVICMIND's AI compares **GPS coordinates** (within a 250m radius) and **semantic text similarity**.
- High similarity (>75%) triggers a duplicate candidate suggestion.
- Authorities can merge them into a single primary dispatch ticket with one click.
- All reporters receive unified updates, saving municipal crews redundant truck rollouts.`;
  }

  if (q.includes('track') || q.includes('status') || q.includes('id')) {
    return `### Tracking Your Civic Complaint:
- Go to the **"Citizen Portal"** (\`/citizen\`) to view all your reported issues.
- You can filter by **All, In Review, In Progress, or Resolved**.
- Each complaint displays a real-time **4-stage progress timeline** with timestamped crew dispatch notes.
- Have a Tracking ID? Enter it in the search bar to view its complete AI triage dossier.`;
  }

  if (q.includes('ward') || q.includes('sla') || q.includes('hotspot')) {
    return `### Municipal Wards & Hotspot Surveillance:
CIVICMIND continuously aggregates complaints into ward-by-ward risk density grids:
- **Ward 4 (Metro Center)**: Highest traffic volume, expedited 4-hour pothole triage.
- **Ward 2 (Commercial)**: Heavy street lighting and pedestrian corridor surveillance.
- **Ward 7 (South Heights)**: Monitored for recurring stormwater drainage bottlenecks.
- Check the **Intelligence page** (\`/intelligence\`) to see real-time GIS density maps and AI action briefs!`;
  }

  return `Hello! I am **CIVICMIND AI**, your municipal assistant. I can help you:
- **Report civic problems** (potholes, leaks, broken streetlights, trash).
- **Understand AI Priority Scores** and emergency SLA response times.
- **Track status updates** on existing municipal complaints.
- **Learn how duplicate clustering** saves taxpayer resources.

What would you like to know or report today?`;
}

// Server-side Gemini API endpoint
app.post('/api/assistant', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const isPlaceholderKey = !apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.includes('YOUR_');
    if (!genAI || isPlaceholderKey) {
      // Gracefully use instant domain-informed response
      const reply = getDomainFallbackResponse(message);
      res.json({ reply, source: 'domain_ai' });
      return;
    }

    const systemInstruction = `You are CIVICMIND AI, the intelligent civic assistant for the CIVICMIND civic-tech platform. 
CIVICMIND transforms scattered citizen complaints into prioritized, explainable, and trackable municipal actions.
You help citizens and municipal staff by answering questions about:
1. Reporting civic issues (Road damage & potholes, water & sewage leaks, overflowing garbage bins, broken streetlights, traffic signal faults).
2. Priority scoring: CIVICMIND calculates transparent scores from 0-100 based on public safety hazards, school/hospital zone proximity, infrastructure vulnerability, and crowd corroboration.
3. Duplicate clustering: Multiple complaints within 250m describing the same defect are automatically grouped to save municipal resources.
4. Municipal response SLAs: Critical hazards (<4hr SLA), High priority (<24hr SLA), Medium priority (<48hr SLA), Low priority (<72hr SLA).
5. Tracking & Navigation: Guide users to relevant sections (/report to file, /citizen to track, /authority for dispatch CAD, /management for registry table, /intelligence for GIS clustering).
Provide concise, helpful, and empathetic responses with crisp markdown formatting. Always keep answers scannable and polite.`;

    try {
      const chatContents = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          chatContents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }]
          });
        }
      }
      chatContents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI generation timed out')), 4000)
      );

      const response = await Promise.race([
        genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: chatContents,
          config: {
            systemInstruction,
            temperature: 0.6,
            maxOutputTokens: 600,
          }
        }),
        timeoutPromise
      ]);

      const reply = response.text || getDomainFallbackResponse(message);
      res.json({ reply, source: 'gemini' });
    } catch (apiError: any) {
      console.warn('Gemini API call timed out or failed, using domain fallback:', apiError?.message || apiError);
      const fallbackReply = getDomainFallbackResponse(message);
      res.json({ reply: fallbackReply, source: 'domain_ai' });
    }
  } catch (err: any) {
    console.error('Assistant endpoint error:', err);
    res.status(500).json({ error: 'Failed to process assistant request' });
  }
});

// Mount Vite or static build
async function startServer() {
  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`CIVICMIND Server running on port ${port} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
