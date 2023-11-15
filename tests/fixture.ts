export const script = `(() => {
    "use strict";
  
    Object.getOwnPropertyNames(window)
      .filter((name) => /^HTML/.test(name))
      .forEach((name) => {
        const originalAddEventListener = window[name].prototype.addEventListener;
  
        const proto = window[name].prototype;
  
        proto.addEventListener = function (...args) {
          if (!args[1] || typeof args[1] !== "function") {
            return originalAddEventListener.apply(this, args);
          }
  
          window.dispatchEvent(
            new CustomEvent("addlistenerwrap", {
              detail: {
                func: args[1],
              },
            })
          );
  
          const [, originalListener] = args;
  
          const modifiedListener = function (...functionArgs) {
            if (functionArgs.some((arg) => arg && !arg.isTrusted)) {
              window.dispatchEvent(
                new CustomEvent("addlistenerviolation", {
                  detail: {
                    args: functionArgs,
                  },
                })
              );
  
              return;
            }
  
            return originalListener.apply(this, functionArgs);
          };
  
          args[1] = modifiedListener;
  
          return originalAddEventListener.apply(this, args);
        };
  
        if (proto.attachEvent) {
          proto.attachEvent = proto.addEventListener;
        }
      });
  
    const overrideOnEvents = () => {
      const onEventKeyList = Object.getOwnPropertyNames(
        window.HTMLElement.prototype
      ).filter((name) => name.startsWith("on"));
  
      [...document.querySelectorAll("*")].forEach((node) => {
        onEventKeyList.forEach((eventName) => {
          if (typeof node[eventName] === "function") {
            const handler = node[eventName];
  
            node[eventName] = null;
  
            window.dispatchEvent(
              new CustomEvent("onclickwrap", {
                detail: {
                  func: node[eventName],
                },
              })
            );
  
            window.dispatchEvent(
              new CustomEvent("oneventwrap", {
                detail: {
                  func: node[eventName],
                },
              })
            );
  
            node[eventName] = function (...args) {
              if (args.some((arg) => arg && !arg.isTrusted)) {
                window.dispatchEvent(
                  new CustomEvent("onclickviolation", {
                    detail: {
                      args,
                    },
                  })
                );
  
                window.dispatchEvent(
                  new CustomEvent("oneventviolation", {
                    detail: {
                      args,
                    },
                  })
                );
  
                return;
              }
  
              return handler.apply(this, args);
            };
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
  `;
