# Scratch on mobile

A small visual coding editor inspired by [MIT Scratch](https://scratch.mit.edu/projects/editor/). It was built for the Juspay **MIT_Scratch** assignment.

The original brief is for a web app. I built it as a mobile app (iOS and Android) with React Native and Expo.

## Demo

[Watch the screen recording on Google Drive](https://drive.google.com/file/d/1VQtMhO5cZpKH0kCKnafUH3Z_rPrkDWt6/view?usp=sharing)

## Running it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS), or press `i` / `a` to open a simulator. No extra native modules are used, so it runs in Expo Go.

## What's built

### Blocks

| Category | Blocks |
| --- | --- |
| Motion | `move (10) steps`, `turn (15) degrees`, `go to x: (0) y: (0)` |
| Looks | `say (Hello!) for (2) seconds`, `think (Hmm...) for (2) seconds` |
| Control | `repeat (10)` (wraps other blocks) |

Every value in a block can be edited by tapping it.

### Drag and drop

- Drag a block from the palette into the script area.
- Long press a block in the script to pick it up. You can then reorder it, or drop it inside a `repeat`.
- Drag a script block out of the script area to delete it.

### Multiple sprites

- **+ Sprite** adds a sprite. **Delete** removes the selected one.
- Tap a sprite in the list to see and edit its script. Each sprite has its own script.
- **Play** runs every sprite's script at the same time. **Reset** puts every sprite back at its starting position.

### Hero feature: collision swap

While playing, when two sprites touch, their scripts swap and both start again from the top. The swap also shows in the editor.

To try the example from the brief:

1. Sprite1 (left): `repeat 10` with `move 10 steps` inside
2. Add Sprite2 (right): `repeat 10` with `move -10 steps` inside
3. Press **Play**. They walk towards each other and touch. Sprite1 then moves -10 and Sprite2 moves 10, so they walk apart.

## How it works

### Project layout

```
src/
  app/index.tsx           the only screen, wires everything together
  blocks/
    types.ts              Block, BlockDef, categories
    catalog.ts            block definitions (label, inputs, defaults, color)
    tree.ts               insert / move / remove / update in the block tree
  components/
    stage.tsx             draws the sprites and speech bubbles
    sprite-list.tsx       sprite picker, add and delete
    palette.tsx           category tabs and draggable blocks
    script-area.tsx       the selected sprite's script, renders repeat bodies
    block-view.tsx        a single block with its inputs
    draggable.tsx         pan gesture wrapper
  hooks/
    use-sprites.ts        sprite list, selected sprite, script updates
    use-drag-drop.ts      drag state, drop targets, hit testing
  engine/
    run-script.ts         runs one sprite's script
    play.ts               runs all sprites and handles collisions
```

### Data

A script is a tree of blocks:

```ts
type Block = { id: string; type: BlockType; args: Record<string, string>; children?: Block[] };
```

Only `repeat` has `children`. Each block type has an entry in `catalog.ts` that lists its label parts, inputs and defaults. The palette, the script and the drag preview all draw from that same entry.

Each sprite holds its own `blocks`, plus Reanimated shared values for `x`, `y` and `direction`. Movement runs on the UI thread and doesn't re-render React.

### Stage coordinates

Same as Scratch: a 480 × 360 stage with (0, 0) at the centre and y pointing up. It's scaled to the screen width. Direction 90 faces right, and turning is clockwise. Sprites are kept inside the stage edges.

### Drag and drop

- Built on `react-native-gesture-handler` (`Gesture.Pan`). A copy of the block follows the finger in an overlay at the root of the screen.
- The script area, every block row and every repeat body register themselves as drop targets.
- On release, the targets are measured with `measureInWindow`. The smallest one under the finger is used:
  - a block row means "insert before this block"
  - a repeat body means "add to the end of this repeat"
  - the script area means "add to the end of the script"
- Script blocks use a long press to start a drag, so the script list can still scroll.

### Running scripts

- `runScript` walks the tree with `async`/`await`.
- `move`, `turn` and `go to` animate with `withTiming`. The next block starts when the animation ends.
- `say` and `think` show a bubble for N seconds.
- `repeat` runs its children N times.
- Each run has a `{ cancelled }` token, which is checked before every block.

### Collision swap

`playAll` starts every sprite's script together. While they run, it checks the distance between each pair of sprites every frame.

When two sprites come within range, both current runs are cancelled. Each sprite then restarts with the other's script, and the scripts are swapped in state too. A pair only swaps when the sprites first touch, not on every frame while they overlap. Play finishes once every running script is done.

## Decisions and limits

- **TypeScript instead of ReScript, `StyleSheet` instead of Tailwind:** this keeps the project a plain Expo app with nothing extra to set up.
- **Simple sprites:** sprites are emoji, not the Scratch cat.
- **No Stop button:** a running script has to finish before you can play again. Editing is still allowed while it runs.
- **Collision is centre distance:** a simple circle check, not pixel-perfect.
