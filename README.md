# 2D Shooting Game Requirements Presentation

Web-based requirement definition presentation for a 2D shooting game, built with React, Vite, TypeScript, and Remotion.

The presentation contains seven slides and includes animated in-slide game demos for the core gameplay, progression, recovery/retry flow, and the final boss rollback mechanic.

## Requirements Definition

- Source document: [`REQUIREMENTS.md`](./REQUIREMENTS.md)
- Web view: `https://slide.temp.riyo.me/requirements`

The requirements document covers gameplay, the final boss rollback mechanic, CSR/static hosting, 24/7 publication, GitHub source operation, MIT licensing, and AI/Coding Agent handling rules.

## Development

```powershell
npm install
npm run dev
```

## Checks

```powershell
npm run lint
npm run typecheck
npm run build
```

## Controls

- Left / Right Arrow: previous / next slide
- Space: pause / resume the animated demo
- Home / End: first / last slide
- Fullscreen button: enter / exit fullscreen

## Deployment

- Host: Cloudflare Workers & Pages
- Presentation: `https://slide.temp.riyo.me`
- Requirements: `https://slide.temp.riyo.me/requirements`
- Mobile speaker notes: `https://slide.temp.riyo.me/notes`
- Build command: `npm run build`
- Output directory: `dist`

## License

MIT License.
