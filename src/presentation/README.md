# Presentation

This directory contains the active 7-slide requirements-definition presentation.

## Active files

- `Presentation.tsx` — Remotion Player wrapper, keyboard navigation, toolbar, speaker notes, fullscreen controls
- `SlideContent.tsx` — slide contents
- `content.ts` — slide titles, timing, and speaker notes
- `GameDemo.tsx` — animated gameplay examples shown inside slides
- `demo-model.ts` — deterministic model used by the boss rollback demo
- `SlideTransition.tsx` — slide-to-slide transition implementation
- `presentation.css` — presentation and demo styles

## Notes

- The active deck title is `2Dシューティングゲーム 要求定義`.
- `TransitionLab.tsx` is only a transition experiment, not the production deck.
- `archive/requirements-demo/` is archived material and should not be treated as the current presentation.
- Game demo visuals and numeric values are explanatory examples unless the requirements explicitly define them.
- Do not redesign the presentation or change its visual direction unless the user explicitly requests it.
