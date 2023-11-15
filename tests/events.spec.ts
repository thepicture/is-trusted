import { test } from "@playwright/test";
import { script } from "./fixture";

test("when event listener added then fires addlistenerwrap", async ({
  page,
}) => {
  await page.evaluate((script) => {
    window.addEventListener("addlistenerwrap", () =>
      document.body.classList.add("done")
    );

    eval(script);

    window.document.body.addEventListener("click", console.log);
  }, script);

  await page.waitForFunction(() => document.querySelector(".done"));
});

test("when on-x event added then fires oneventwrap", async ({ page }) => {
  await page.evaluate((script) => {
    window.addEventListener("oneventwrap", () =>
      document.body.classList.add("done")
    );

    eval(script);

    const element = document.createElement("button");
    element.onclick = console.log;
    document.body.append(element);
  }, script);

  await page.waitForFunction(() => document.querySelector(".done"));
});

test("when add listener event fire is synthetic  then fires addlistenerviolation", async ({
  page,
}) => {
  await page.evaluate((script) => {
    window.addEventListener("addlistenerviolation", () =>
      document.body.classList.add("done")
    );

    eval(script);

    const element = document.createElement("button");
    element.addEventListener("click", console.log);

    document.body.append(element);

    element.click();
  }, script);

  await page.waitForFunction(() => document.querySelector(".done"));
});

test("when add listener event fire is synthetic  then fires oneventviolation", async ({
  page,
}) => {
  await page.evaluate((script) => {
    window.addEventListener("oneventviolation", () =>
      document.body.classList.add("done")
    );

    eval(script);

    const element = document.createElement("button");
    element.onclick = console.log;

    document.body.append(element);

    Promise.resolve().then(() => {
      document.querySelector("button")?.dispatchEvent(new MouseEvent("click"));
    });
  }, script);

  await page.waitForFunction(() => document.querySelector(".done"));
});
