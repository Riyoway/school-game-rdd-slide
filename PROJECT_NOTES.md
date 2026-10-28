# Project Notes

## Confirmed

- Project path: `C:\Users\Riyo\Developments\Slide`
- Presentation is implemented as a web application.
- Stack: React + Vite + TypeScript + Remotion Player.
- No music / BGM.
- Arrow-key navigation is implemented.
- Public deployment target: `https://slide.temp.riyo.me`
- Hosting target: Cloudflare Pages / Workers & Pages.
- Presentation is designed for normal browsers on other devices.
- Current deck: 7 slides for a 5-minute requirements-definition presentation.
- Current title: `2Dシューティングゲーム 要求定義`.
- Game demo panels are implemented as animated in-browser examples, not final game visuals.
- Lucide icons are used for UI/iconography.
- Speaker notes, fullscreen, pause/play, and reduced-motion handling are implemented.

## Current slide structure

1. ゲームの概要
2. 基本仕様と敵
3. ポイント・強化・バフ
4. 回復と敗北時の処理
5. 最終ボスの時間巻き戻し
6. 開発・公開条件
7. 必須要件と実装班の裁量

## Presentation implementation

- Presentation shell: `src/presentation/Presentation.tsx`
- Slide content: `src/presentation/SlideContent.tsx`
- Slide metadata / speaker notes: `src/presentation/content.ts`
- Animated game examples: `src/presentation/GameDemo.tsx`
- Boss rollback model: `src/presentation/demo-model.ts`
- Slide transition: `src/presentation/SlideTransition.tsx`
- Presentation styles: `src/presentation/presentation.css`

## Notes

- `TransitionLab.tsx` is only a technical transition experiment and is not the production deck.
- `archive/requirements-demo/` contains previous/experimental material and is not part of the active presentation.
- The visual design may still be adjusted by the user; do not replace it with a new theme without explicit instruction.
- The game demo appearance and numerical values are examples only unless stated otherwise in the requirements.

## Validation

Before finishing changes, run:

```powershell
npm run lint
npm run typecheck
npm run build
```

The boss demo model can also be checked with:

```powershell
node scripts/check-demo.mjs
```
