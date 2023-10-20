# is-trusted

Intercepts `addEventListener`, `attachEvent` and `on` events by checking origin of event

## Usage

Append `index.js` script tag before all scripts in `head`

## API

```js
window.addEventListener("addlistenerwrap", (event: CustomEvent<Function>)); // fires on addEventListener/attachEvent
window.addEventListener("oneventwrap", (event: CustomEvent<Function>)); // fires when wrapping the original function for additional middleware
window.addEventListener("addlistenerviolation", (event: CustomEvent<Args>)); // fires on addEventListener/attachEvent non-trusted event origin
window.addEventListener("oneventviolation", (event: CustomEvent<Args>)); // fires on "on" event non-trusted origin
```

## Test

```js
(() => {
  const b = document.createElement("b");

  b.addEventListener("click", () => console.log("trusted"));
  b.textContent = "click";

  document.body.prepend(b);
})();

document.querySelector("b").click(); // event does not fire
document.querySelector("b").dispatchEvent(new MouseEvent("click")); // event does not fire

// Event fires on manual click
```
