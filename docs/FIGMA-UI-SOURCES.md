# Figma UI sources

The UI controls were sourced from Figma’s **Simple Design System** on 7 October 2026.
Actual library instances are preserved intact on the
[EKSTAZ UI reference board](https://www.figma.com/design/NfmqmTKNts0c0ybsSamRrJ?node-id=2-293).
This board records control structure and states; EKSTAZ’s original artwork, identity and
particle animation remain their own source material.

## Imported references

| Reference | Published source key | Default geometry | States |
| --- | --- | --- | --- |
| [Button](https://www.figma.com/design/NfmqmTKNts0c0ybsSamRrJ?node-id=2-231) | `cc8b558dc7d9684011b6b99ce8e6509399bc836b` | Primary / Medium, 75 × 40 px; 12 px padding; 8 px gap; 8 px radius | Default, Hover, Disabled; Primary, Neutral and Subtle variants |
| [Icon Button](https://www.figma.com/design/NfmqmTKNts0c0ybsSamRrJ?node-id=2-235) | `e098805c9e6db6bfa6a87de61a8324a545d42501` | Primary / Medium, 44 × 44 px; 12 px padding; 8 px gap; 32 px radius; 20 px icon | Default, Hover, Disabled; Primary, Neutral and Subtle variants |
| [Pagination Next](https://www.figma.com/design/NfmqmTKNts0c0ybsSamRrJ?node-id=2-239) | `95a214754e4bffa515bc774abb95a15c172a7d00` | 84 × 32 px; 8 px vertical / 12 px horizontal padding; 8 px gap; 8 px radius; 16 px arrow | Default: transparent; Hover: filled; Disabled: 50% opacity |
| [Pagination](https://www.figma.com/design/NfmqmTKNts0c0ybsSamRrJ?node-id=2-244) | `b86dd6cf2e3f4ecc779a4f2d203b580900e60527` | 489 × 38 px; horizontal layout; 8 px gap; current page distinguished from other pages | Previous, current page, other pages and Next |

Measurements came from the imported source components. Button and Pagination Next
were also checked with Figma design context and screenshots. Their source labels use
Inter Regular at 16 px; the website retains its existing Space Mono controls and Bodoni
Moda display type. Widths in the source table belong to the sample labels, not fixed
width requirements for the website.

## Website adaptation

The site uses native HTML and existing CSS, with no frontend component-library or
framework dependency. The source patterns are adapted to the established near-black,
bone and crimson palette and existing pill-shaped controls.

- The sticky journey continuation uses Pagination Next’s **8 px gap and 8 / 12 px
  padding**, with an outlined pill, a visible hover fill and a minimum 44 px target.
  Native downward/upward glyphs indicate the actual journey direction.
- Existing primary actions keep clear Default, Hover and Disabled states. Sound controls
  keep their labels and `aria-pressed` state. Control buttons retain at least
  44 px targets, including controls whose source samples are smaller.
- The journey retains its visible current chapter, actual destination labels, native
  anchors, keyboard focus and browser history. The Pagination reference informs
  orientation without adding a row of unnecessary page buttons.

These controls guide the encounter while the six particle states remain prominent in
their own visual stages. Original artwork keeps its full image view and unchanged
colours and proportions.
