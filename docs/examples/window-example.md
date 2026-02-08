---
outline: deep
---

# Window Example

Example showing how to open VueFinder in a popup window and return selected files back to the parent window.

## Live Demo

<ClientOnly>
  <WindowExampleDemo />
</ClientOnly>

## How It Works

1. Parent page opens a dedicated popup route (`/examples/window-picker`) with VueFinder only.
2. User selects files in popup.
3. Popup sends selected files back using `window.opener.postMessage(...)`.
4. Parent receives and displays selected files.

## Code Example

```ts
// Parent
window.open('/examples/window-picker', 'vuefinder-popup', 'width=900,height=600');

window.addEventListener('message', (event) => {
  if (event.data?.type === 'window-demo-files-selected') {
    console.log('Selected in popup:', event.data.files);
  }
});

// Popup
window.opener?.postMessage(
  { type: 'window-demo-files-selected', files: selectedItems },
  '*'
);
```

## Notes

- Popup opening requires a user action (button click) in most browsers.
- The popup window is a dedicated picker page that displays only VueFinder.
- This pattern is useful for picker flows where you want to keep parent UI context intact.
- In production, validate `event.origin` before trusting `postMessage` payloads.
