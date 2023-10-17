# is-trusted

```
Intercepts addEventListener by checking if the event is originated by user
```

## Usage

Append `index.js` script tag before all scripts in `head`

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
