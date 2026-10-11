import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '2mb' }));

// Initialize GoogleGenAI server-side with required User-Agent
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 5) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('[ESWAR Server] Gemini API initialization notice:', err);
  }
}

// Status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    name: 'E.S.W.A.R.',
    tagline: 'Don’t just plan your future. Explore your possibilities.',
    hasApiKey: Boolean(aiClient),
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// Future Simulation Generator endpoint
app.post('/api/simulate', async (req: Request, res: Response) => {
  const { prompt, horizon = '90 days', userProfile = {}, customAssumptions = {} } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
    return res.status(400).json({ error: 'Please provide a valid exploration prompt.' });
  }

  const systemInstruction = `You are E.S.W.A.R. (Explore, Simulate, What-if, Act, Reflect) — a personal future simulation engine.
The user wants to explore a question or decision: "${prompt.trim()}".
User context: Name: ${userProfile.name || 'Explorer'}, Horizon: ${horizon}, Primary focus: ${userProfile.primaryFocus || 'Personal & Professional Growth'}, Available time: ${userProfile.dailyHours || '1-2'} hours/day.
Additional tweaked assumptions: ${JSON.stringify(customAssumptions)}.

CRITICAL PRINCIPLES:
1. Never claim to know the future with certainty. Frame all outcomes as plausible heuristic estimates, probabilities of friction, and scenario models based on decision theory.
2. Generate exactly THREE distinct paths:
   - Path A: "Current Path" (Status Quo & Inertia) — What could happen if default patterns and passive momentum continue with typical distractions.
   - Path B: "Intentional Path" (Practical Optimization) — What could happen with disciplined execution, structured habits, and mindful boundaries.
   - Path C: "Alternative Path" (Unconventional Pivot) — An alternative strategic angle with distinctly different trade-offs, higher optionality, or altered pacing.
3. Every path must be realistic, nuanced, and actionable.

Return ONLY a strict, valid JSON object conforming to this schema (do NOT wrap in markdown fences if possible, or use standard JSON):
{
  "query": "${prompt.trim()}",
  "horizon": "${horizon}",
  "scenarios": [
    {
      "id": "path-a",
      "pathType": "current",
      "title": "String (e.g., Default Trajectory: Fragmented Effort)",
      "badge": "Current Path",
      "summary": "String (2-3 sentences explaining what could happen)",
      "confidenceLevel": "Moderate Probability (65% inertia rate)",
      "timeline": [
        { "time": "Day 14", "milestone": "Short title", "description": "What happens", "indicator": "Key signal" },
        { "time": "Day 45", "milestone": "Short title", "description": "What happens", "indicator": "Key signal" },
        { "time": "Day 90", "milestone": "Short title", "description": "What happens", "indicator": "Key signal" }
      ],
      "requiredEffort": "e.g. Sporadic 2-4 hrs/week, low discipline friction",
      "requiredResources": ["Resource 1", "Resource 2"],
      "potentialBenefits": ["Benefit 1", "Benefit 2"],
      "risksAndUncertainties": ["Risk 1", "Risk 2", "Risk 3"],
      "assumptions": ["Assumption 1", "Assumption 2"],
      "immediateAction": "A practical first step to take today to test this path",
      "scores": { "effort": 2, "upside": 2, "friction": 4 }
    },
    {
      "id": "path-b",
      "pathType": "intentional",
      "title": "String (e.g., The Deliberate Crucible: Daily 60-Minute Deep Work)",
      "badge": "Intentional Path",
      "summary": "String",
      "confidenceLevel": "High Leverage / Requires 80%+ consistency",
      "timeline": [
        { "time": "Day 14", "milestone": "Short title", "description": "What happens", "indicator": "Key signal" },
        { "time": "Day 45", "milestone": "Short title", "description": "What happens", "indicator": "Key signal" },
        { "time": "Day 90", "milestone": "Short title", "description": "What happens", "indicator": "Key signal" }
      ],
      "requiredEffort": "e.g. 7 hrs/week strictly blocked daily, high cognitive focus",
      "requiredResources": ["Resource 1", "Resource 2"],
      "potentialBenefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
      "risksAndUncertainties": ["Risk 1", "Risk 2"],
      "assumptions": ["Assumption 1", "Assumption 2"],
      "immediateAction": "The exact action to start within the next 2 hours",
      "scores": { "effort": 4, "upside": 5, "friction": 3 }
    },
    {
      "id": "path-c",
      "pathType": "alternative",
      "title": "String (e.g., Sprint & Rest: Weekend Deep Dives + Micro-Shipments)",
      "badge": "Alternative Path",
      "summary": "String",
      "confidenceLevel": "High Flexibility / Asymmetric Upside",
      "timeline": [
        { "time": "Day 14", "milestone": "Short title", "description": "What happens", "indicator": "Key signal" },
        { "time": "Day 45", "milestone": "Short title", "description": "What happens", "indicator": "Key signal" },
        { "time": "Day 90", "milestone": "Short title", "description": "What happens", "indicator": "Key signal" }
      ],
      "requiredEffort": "e.g. Clustered 4-hour weekend bursts + 15 min daily micro-review",
      "requiredResources": ["Resource 1", "Resource 2"],
      "potentialBenefits": ["Benefit 1", "Benefit 2"],
      "risksAndUncertainties": ["Risk 1", "Risk 2"],
      "assumptions": ["Assumption 1", "Assumption 2"],
      "immediateAction": "A low-friction test step for this alternative angle",
      "scores": { "effort": 3, "upside": 4, "friction": 2 }
    }
  ],
  "comparativeInsight": "A sharp 2-sentence executive summary comparing the core trade-offs between Path A, B, and C.",
  "epistemicDisclaimer": "These projections are estimated future simulations based on behavioral heuristics and stated assumptions, not deterministic predictions."
}`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt.trim(),
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.65,
        },
      });

      const responseText = response.text?.trim() || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({
          source: 'gemini-3.8-flash',
          isLiveAi: true,
          ...parsed,
        });
      } catch (jsonErr) {
        console.warn('[ESWAR] JSON parse failed, extracting clean JSON:', jsonErr);
        const match = responseText.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          return res.json({
            source: 'gemini-3.8-flash',
            isLiveAi: true,
            ...parsed,
          });
        }
      }
    } catch (apiErr: any) {
      console.warn('[ESWAR] Gemini API call error, utilizing deterministic simulation engine:', apiErr?.message || apiErr);
    }
  }

  // Realistic deterministic heuristic simulation engine (Demo & Fallback Mode)
  const simulation = generateHeuristicSimulation(prompt.trim(), horizon, userProfile, customAssumptions);
  return res.json({
    source: 'heuristic-engine',
    isLiveAi: false,
    demoNotice: 'Simulation generated via ESWAR Behavioral Heuristics Engine (Live Gemini key unconfigured or rate-limited).',
    ...simulation,
  });
});

// Future Self Reflective Chat endpoint
app.post('/api/future-self', async (req: Request, res: Response) => {
  const { message, horizon = '90 days', history = [], userProfile = {} } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Please provide a message for your Future Self.' });
  }

  const systemInstruction = `You are the user's Future Self speaking to them from ${horizon} in the future.
User context: Name: ${userProfile.name || 'Friend'}, Primary Focus: ${userProfile.primaryFocus || 'Life & Craft'}, Daily Capacity: ${userProfile.dailyHours || '1-2'} hours.
Current goals: ${JSON.stringify(userProfile.goals || [])}.
Completed commitments: ${JSON.stringify(userProfile.recentWins || [])}.

VOICE & TONE:
- Calm, reflective, encouraging, and anchored in reality.
- You have already lived through the friction, excuses, self-doubt, and breakthrough moments of this exact timeframe.
- Do not make grand mystical prophecies or pretend to be psychic. Acknowledge that you are their own reflective projection helping them see through the fog of current stress.
- Keep responses concise (2-4 thoughtful paragraphs maximum).
- End with one gentle, grounding question or a clear micro-action they can do in the next 15 minutes.`;

  if (aiClient) {
    try {
      const formattedContents = [
        ...history.slice(-6).map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        content: response.text?.trim() || "Take a deep breath. Looking back from here, the small steps you take today matter far more than having it all figured out.",
        horizon,
        isLiveAi: true,
      });
    } catch (err: any) {
      console.warn('[ESWAR] Future Self API call failed, falling back:', err?.message || err);
    }
  }

  // Compassionate heuristic response
  const fallbackResponse = generateFutureSelfFallback(message, horizon, userProfile);
  return res.json({
    content: fallbackResponse,
    horizon,
    isLiveAi: false,
    demoNotice: 'Response generated via ESWAR Reflective Persona.',
  });
});

// Compare Decisions endpoint
app.post('/api/compare-decisions', async (req: Request, res: Response) => {
  const { optionA, optionB, context = '', userProfile = {} } = req.body;

  if (!optionA || !optionB) {
    return res.status(400).json({ error: 'Please provide both Option A and Option B.' });
  }

  const prompt = `Compare these two decisions for ${userProfile.name || 'the user'}:
Decision A: "${optionA}"
Decision B: "${optionB}"
Context: "${context}"

Analyze both options with clear, objective trade-offs across:
1. Immediate friction (Week 1-2)
2. Compounding upside (Month 1-3)
3. Irreversibility / Downside risk
4. Energy/Cognitive tax
5. Recommended synthesis or decisive recommendation.

Return a valid JSON object:
{
  "summary": "Crisp overview comparing both paths",
  "optionA": {
    "name": "${optionA}",
    "strengths": ["string", "string"],
    "drawbacks": ["string", "string"],
    "timeToValue": "e.g. 2 weeks",
    "optionality": "High / Medium / Low",
    "frictionScore": 1-5,
    "growthScore": 1-5
  },
  "optionB": {
    "name": "${optionB}",
    "strengths": ["string", "string"],
    "drawbacks": ["string", "string"],
    "timeToValue": "e.g. 6 weeks",
    "optionality": "High / Medium / Low",
    "frictionScore": 1-5,
    "growthScore": 1-5
  },
  "verdict": "Clear, balanced perspective on which condition favors which decision",
  "experimentQuestion": "A low-stakes question or 3-day test to know for sure before committing"
}`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });
      const parsed = JSON.parse(response.text?.trim() || '{}');
      return res.json({ isLiveAi: true, ...parsed });
    } catch (err) {
      console.warn('[ESWAR] Decision comparison fallback:', err);
    }
  }

  return res.json({
    isLiveAi: false,
    summary: `Comparing "${optionA}" against "${optionB}". Each option trades off immediate certainty against asymmetric upside.`,
    optionA: {
      name: optionA,
      strengths: ['Immediate familiarity', 'Predictable short-term trajectory', 'Lower psychological startup friction'],
      drawbacks: ['Potential plateau', 'Opportunity cost on higher-leverage bets'],
      timeToValue: '1-2 weeks',
      optionality: 'Medium',
      frictionScore: 2,
      growthScore: 3,
    },
    optionB: {
      name: optionB,
      strengths: ['Steeper learning curve', 'Higher potential transformation', 'Unlocks new non-linear opportunities'],
      drawbacks: ['Higher early uncertainty', 'Requires dedicated energy defense'],
      timeToValue: '4-8 weeks',
      optionality: 'High',
      frictionScore: 4,
      growthScore: 5,
    },
    verdict: `If your current priority is baseline stability, start with a bounded trial of Option A. If you have energy cushion and desire genuine leverage, lean into Option B with a 14-day kill switch.`,
    experimentQuestion: `What is a 48-hour micro-version of both that requires less than 2 hours to test?`,
  });
});

// Daily Action Recommendation endpoint
app.post('/api/daily-action', async (req: Request, res: Response) => {
  const { goals = [], recentLogs = [], userProfile = {} } = req.body;
  const focus = userProfile.primaryFocus || (goals[0]?.title || 'Key Objectives');

  return res.json({
    action: `Dedicate one uninterrupted 45-minute block to "${focus}" before checking notification channels.`,
    rationale: 'Protecting your prime mental energy before reactive stimuli multiply your friction by 3x.',
    priorityGoal: focus,
    timeRequiredMinutes: 45,
    frictionLevel: 'Low-Medium',
  });
});

// Heuristic fallback generator for simulation
function generateHeuristicSimulation(prompt: string, horizon: string, profile: any, assumptions: any) {
  const cleanPrompt = prompt.toLowerCase();
  const userName = profile?.name || 'You';

  let subject = 'your chosen commitment';
  if (cleanPrompt.includes('programm') || cleanPrompt.includes('code')) {
    subject = 'programming and software building';
  } else if (cleanPrompt.includes('exam') || cleanPrompt.includes('college') || cleanPrompt.includes('study')) {
    subject = 'academic demands with technical creative building';
  } else if (cleanPrompt.includes('social media') || cleanPrompt.includes('phone') || cleanPrompt.includes('distraction')) {
    subject = 'digital attention reclaim and cognitive focus';
  } else if (cleanPrompt.includes('goal') || cleanPrompt.includes('priority')) {
    subject = 'strategic goal sequencing and focus triage';
  }

  return {
    query: prompt,
    horizon,
    scenarios: [
      {
        id: 'path-a',
        pathType: 'current',
        title: 'Status Quo Inertia: The Fragmented Effort Loop',
        badge: 'Current Path',
        summary: `If you continue with your current baseline without deliberate calendar boundaries, progress on ${subject} remains sporadic. High-motivation days will alternate with reactive drift.`,
        confidenceLevel: 'High Likelihood if environment remains unchanged',
        timeline: [
          {
            time: 'Day 10',
            milestone: 'The Initial Dip',
            description: 'Early enthusiasm meets unexpected external interruptions; 2-3 consecutive planned sessions get skipped.',
            indicator: 'Guilt triggers avoidance instead of quick recalibration.',
          },
          {
            time: 'Day 35',
            milestone: 'Sub-threshold Momentum',
            description: 'You have invested ~15 scattered hours. You grasp basics, but context-switching prevents flow state.',
            indicator: 'Starting feels as heavy as Day 1.',
          },
          {
            time: 'Day 90',
            milestone: 'Partial Footprint',
            description: 'You achieve roughly 25-35% of your ideal target. Valuable awareness gained, but without breakthrough leverage.',
            indicator: 'Project remains a "work in progress".',
          },
        ],
        requiredEffort: 'Variable 2-4 hours/week, reactive scheduling',
        requiredResources: ['Standard willpower', 'Ad-hoc calendar gaps', 'Current toolset'],
        potentialBenefits: ['Low perceived short-term pressure', 'Preserved familiar comfort zone'],
        risksAndUncertainties: ['Chronic open cognitive loops', 'Self-trust erosion due to missed quiet promises'],
        assumptions: ['No deliberate time-blocking', 'Notifications remain active during work windows', 'No public accountability'],
        immediateAction: 'Log the exact friction point that derailed your last two sessions.',
        scores: { effort: 2, upside: 2, friction: 4 },
      },
      {
        id: 'path-b',
        pathType: 'intentional',
        title: 'The Intentional Protocol: Daily 60-Minute Protected Focus',
        badge: 'Intentional Path',
        summary: `By securing an untouchable 60-minute window at the same time each day for ${subject}, you bypass willpower friction. Consistency compounds into genuine velocity.`,
        confidenceLevel: 'Requires 80%+ session adherence',
        timeline: [
          {
            time: 'Day 14',
            milestone: 'Friction Desensitization',
            description: 'The hardest resistance window passes. Starting no longer requires a lengthy internal debate.',
            indicator: '12 of 14 sessions logged; first mini-milestone delivered.',
          },
          {
            time: 'Day 45',
            milestone: 'The Compounding Inflection',
            description: 'You reach ~45 pure hours. Concepts connect fluidly, and you can solve problems without constant tutorial lookup.',
            indicator: 'You feel forward momentum rather than uphill drag.',
          },
          {
            time: 'Day 90',
            milestone: 'Tangible Mastery Artifact',
            description: 'Over 80 focused hours logged. A complete, working outcome or portfolio asset is finished and verifiable.',
            indicator: 'Deep self-efficacy and tangible tangible proof of capability.',
          },
        ],
        requiredEffort: 'Strict 7 hours/week (60 min daily), early morning or fixed evening slot',
        requiredResources: ['Dedicated distraction-free workspace', 'Curated single curriculum or roadmap', 'Accountability log'],
        potentialBenefits: ['Predictable skill acquisition', 'Rebuilt self-confidence', 'Concrete portfolio project'],
        risksAndUncertainties: ['Occasional fatigue during high-stress life spikes', 'Risk of perfectionism burn-out if 1 day is missed'],
        assumptions: ['Phone in Do-Not-Disturb mode during the 60 minutes', 'Minimum 7 hours sleep maintained', 'Pre-defined daily task list before opening laptop'],
        immediateAction: 'Block off tomorrow morning’s 60-minute session on your calendar right now.',
        scores: { effort: 4, upside: 5, friction: 3 },
      },
      {
        id: 'path-c',
        pathType: 'alternative',
        title: 'The Asymmetric Sprint: Clustered Deep Dives + Micro-Shipments',
        badge: 'Alternative Path',
        summary: `Instead of demanding rigid daily perfection, you cluster intense 3-hour deep dives onto 2 weekend or low-demand days, paired with 15-minute daily micro-reviews.`,
        confidenceLevel: 'High Resilience against unpredictable weekday schedules',
        timeline: [
          {
            time: 'Day 14',
            milestone: 'Sprint Architecture Established',
            description: 'Two successful deep sessions completed with zero weekday guilt.',
            indicator: 'Calm weekdays with zero cognitive guilt.',
          },
          {
            time: 'Day 45',
            milestone: 'Rapid Prototype Iterations',
            description: 'Longer unbroken blocks allow complex architectural problem-solving that 60-minute slices cannot accommodate.',
            indicator: 'Major milestones shipped in clean chunks.',
          },
          {
            time: 'Day 90',
            milestone: 'Robust Modular Outcome',
            description: '60-70 hours of deep work delivered with lower weekly lifestyle disruption.',
            indicator: 'Sustainable system you can carry for the entire year.',
          },
        ],
        requiredEffort: '2x 3-hour weekend sprints + 15 min daily maintenance review',
        requiredResources: ['Pre-cleared weekend mornings', 'Strict scope boundaries'],
        potentialBenefits: ['Immune to erratic weekday emergency interruptions', 'Extended flow state depth'],
        risksAndUncertainties: ['Weekend fatigue or social schedule conflicts', 'Loss of daily rhythm if micro-reviews are dropped'],
        assumptions: ['Weekends have at least one 3-hour quiet window', 'Micro-reviews keep context warm'],
        immediateAction: 'Schedule your first 3-hour weekend sprint and define its exact deliverable.',
        scores: { effort: 3, upside: 4, friction: 2 },
      },
    ],
    comparativeInsight: `Path A trades off long-term mastery for short-term comfort. Path B offers the highest compounded skill density but demands disciplined calendar defense. Path C provides the best balance if your weekdays have high unpredictability.`,
    epistemicDisclaimer: 'These projections are scenario models based on behavioral compounding and habit friction heuristics, not deterministic certainties.',
  };
}

function generateFutureSelfFallback(message: string, horizon: string, profile: any) {
  const name = profile?.name || 'my friend';
  return `Hello ${name}. Looking back across these ${horizon}, I want you to remember something critical:

Right now, in the moment you're asking this question, you are feeling the weight of all the unknown steps ahead at once. The obstacle is almost never lack of capability—it is cognitive overload and the quiet fear that effort won't yield certainty.

From this vantage point, here is what actually mattered: The days you showed up for just 30 minutes when you didn't feel like it did 80% of the heavy lifting. The anxieties you had about perfection dissolved the moment you shipped imperfect iterations.

What is one decision you can make in the next 15 minutes that relieves pressure and moves just one pebble forward?`;
}

// Vite middleware in dev or static files in production
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ESWAR Server] Running on http://0.0.0.0:${PORT}`);
  });
});
