# 2D Shooting Game Requirements Presentation

Web-based requirement definition presentation for a 2D shooting game, built with React, Vite, TypeScript, and Remotion.

The presentation contains seven slides and includes animated in-slide game demos for the core gameplay, progression, recovery/retry flow, and the final boss rollback mechanic.

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
- Domain: `slide.temp.riyo.me`
- Build command: `npm run build`
- Output directory: `dist`

## License

MIT License.
