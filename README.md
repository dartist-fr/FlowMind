# FlowMind

**Décris. Construis. Automatise.**  
Open-source workflow automation for everyone.

FlowMind is an independent, mobile-friendly workflow studio. This repository starts with a responsive dashboard and a safe, local-first development setup.

> **Early MVP:** workflows created in the current interface exist only in the current browser session. The “Tester” action runs a clearly labelled simulation; no external service is contacted and no real-world action is executed.

## Current starter

- Responsive dark interface with violet accents.
- Dashboard with sample workflows, statuses and search.
- Create a workflow in the current session.
- Explicit simulation feedback.
- Web app manifest as a foundation for installability.

Persistence, the visual node editor, a real execution engine, integrations and AI are not implemented yet.

## Requirements

- Node.js LTS (npm is included).

## Run locally

~~~bash
git clone https://github.com/dartist-fr/FlowMind.git
cd FlowMind
npm install
npm run dev
~~~

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Open on Android over Wi-Fi

1. Connect the computer and Android phone to the same Wi-Fi.
2. Run `npm run dev` on the computer.
3. Find the computer's Wi-Fi IPv4 address with `ipconfig` on Windows.
4. Open `http://YOUR_COMPUTER_IP:5173` in Chrome on Android.
5. Keep the computer and development server running.

Replace `YOUR_COMPUTER_IP` with the real address. This is a local development server, not a public website, and it is not offline-capable yet.

## Commands

~~~bash
npm run dev       # Start the development server
npm run build     # Type-check and build
npm run preview   # Preview the production build
~~~

## Roadmap

1. Foundation and responsive dashboard.
2. Visual workflow editor with nodes, connections and validation.
3. Local persistence and import/export.
4. Safe simulation, step-by-step logs and error handling.
5. PWA installation and offline assets.
6. Integrations and optional AI, with explicit user approval.

## Safety

- A simulation must never claim that an external action really happened.
- Secrets must not be stored in workflow definitions or logs.
- External actions must be validated and explicitly authorised.
- AI, when added, will propose workflow drafts and will not bypass validation.

## Contributing

Issues and pull requests are welcome. Never commit API keys, credentials, real `.env` files or private data.

## License

The repository was created with the intention of using the MIT License. Add a canonical `LICENSE` file before treating the repository as formally licensed.
