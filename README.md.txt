# LearnFlux AI — Antigravity-ready prototype

## Run locally
1. Open this folder in Antigravity.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local Vite URL.

## Build
`npm run build`

## Product story
Assessment → Knowledge Analysis → Personalized Learning Path → Adaptive Quiz → Updated Recommendations.

## Signature experience
The landing page is a 3D hero built with React Three Fiber. The app includes a persistent contextual AI Tutor prototype.

## AI API
The tutor currently uses deterministic mock responses so the demo works without a backend. Replace the response map in `src/components/AITutor.jsx` with your preferred LLM API or server endpoint before production.

## Note
The 3D text component expects a font asset at `/fonts/Inter_Bold.json`. If your Three.js/Drei setup does not include that asset, remove the `Text3D` blocks in `Hero3D.jsx` or add a compatible font JSON under `public/fonts/`. The core 3D scene works without those labels.
