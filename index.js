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

        const modifiedListener = function (...functionArgs) {
          if (functionArgs.some((arg) => arg && !arg.isTrusted)) {
            return;
          }

          return originalListener.apply(this, functionArgs);
        };

        const originalListener = args[1];
        args[1] = modifiedListener;

        return originalAddEventListener.apply(this, args);
      };
    });
})();
