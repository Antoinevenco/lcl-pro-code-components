# RotatingHeadline

An H1 headline with a static lead phrase followed by a single word that cycles
through a comma-separated list.

```
text   = "la banque de tous les"
values = "entrepreneurs, pro, entrepreneuses, artisans, freelances"
```

renders, in sequence:

```
la banque de tous les entrepreneurs
la banque de tous les pro
la banque de tous les entrepreneuses
…
```

## Props (Webflow Designer surface)

| Prop         | Type   | Default                                                    | Notes                                  |
| ------------ | ------ | ---------------------------------------------------------- | -------------------------------------- |
| `text`       | Text   | `la banque de tous les`                                    | Static lead, shown before the word.    |
| `values`     | Text   | `entrepreneurs, pro, entrepreneuses, artisans, freelances` | Comma-separated; trimmed, blanks drop. |
| `intervalMs` | Number | `2200`                                                     | Time each word stays on screen (ms).   |

## Typography & tokens

The line carries the global `u-text-style-h1` utility class, so font family,
size, line-height, weight and letter-spacing all come from Webflow tokens
(`--_typography---*`) — nothing is hardcoded. The CSS module only owns layout
and the motion, which have no Webflow variable equivalent.

## Motion

- Entering word: rises in from `0.55em` below while fading in.
- Outgoing word: lifts up `0.55em` while fading out.
- 300ms `ease-out`, overlapping (cross-fade), via `framer-motion`.
- Respects `prefers-reduced-motion`: words still swap, but without the slide.

The words are absolutely positioned over an invisible sizer, so the line never
shifts as it reserves width/height for the current word (no layout shift).

## Files

- `RotatingHeadline.tsx` — pure React, no `@webflow` imports.
- `RotatingHeadline.webflow.tsx` — `declareComponent` binding (the only file the
  Webflow CLI reads). Registered in `webflow.json`.
- `RotatingHeadline.module.css` + `styles.ts` — token-driven layout/motion and
  the Vite/webpack CSS-Modules bridge.
