(() => {
  "use strict";

  Object.getOwnPropertyNames(window)
    .filter((name) => /^HTML/.test(name))
    .forEach((name) => {
      const originalAddEventListener = window[name].prototype.addEventListener;

      window[name].prototype.addEventListener = function (...args) {
        if (!args[1] || typeof args[1] !== "function") {
          return originalAddEventListener.apply(this, args);
        }

        const [, originalListener] = args;

        const modifiedListener = function (...functionArgs) {
          if (functionArgs.some((arg) => arg && !arg.isTrusted)) {
            return;
          }

          return originalListener.apply(this, functionArgs);
        };

        args[1] = modifiedListener;

        return originalAddEventListener.apply(this, args);
      };
    });

  const overrideOnEvents = () => {
    [...document.querySelectorAll("*")].forEach((node) => {
      Object.getOwnPropertyNames(window.HTMLElement.prototype)
        .filter((name) => name.startsWith("on"))
        .forEach((eventName) => {
          if (typeof node[eventName] === "function") {
            const handler = node[eventName];

            node[eventName] = null;

            window.addEventListener(eventName.slice(2), function (...args) {
              if (args.some((arg) => arg && !arg.isTrusted)) {
                return;
              }

              return handler.apply(this, args);
            });
          }
        });
    });
  };

  if ("MutationObserver" in window) {
    const observer = new MutationObserver(overrideOnEvents);

    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });
  }
})();
