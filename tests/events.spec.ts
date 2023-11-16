import { test, expect } from "@playwright/test";
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

test("when add listener event fire is synthetic then fires addlistenerviolation", async ({
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

test("when add listener event fire is synthetic then fires oneventviolation", async ({
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
      document.querySelector("button")!.dispatchEvent(new MouseEvent("click"));
    });
  }, script);

  await page.waitForFunction(() => document.querySelector(".done"));
});

test("when add listener event fire is synthetic then fires legacy onclickviolation", async ({
  page,
}) => {
  await page.evaluate((script) => {
    window.addEventListener("onclickviolation", () =>
      document.body.classList.add("done")
    );

    eval(script);

    const element = document.createElement("button");
    element.onclick = console.log;

    document.body.append(element);

    Promise.resolve().then(() => {
      document.querySelector("button")!.dispatchEvent(new MouseEvent("click"));
    });
  }, script);

  await page.waitForFunction(() => document.querySelector(".done"));
});

test("when add listener wrapped then synthetic event has detail func with trusted = false", async ({
  page,
}) => {
  await page.evaluate((script) => {
    window.addEventListener("addlistenerwrap", (event) =>
      document.write(JSON.stringify(event))
    );

    eval(script);

    window.document.body.addEventListener("click", console.log);
  }, script);

  const event = await page.waitForFunction(
    () => document.body.textContent?.includes("{") && document.body.textContent
  );
  const actual = JSON.parse(String(event)).isTrusted;

  expect(actual).toBeFalsy();
});

test("when on-x wrapped then user event has detail func with trusted = false", async ({
  page,
}) => {
  await page.evaluate((script) => {
    window.addEventListener("oneventwrap", (event) =>
      document.write(JSON.stringify(event))
    );

    eval(script);

    const element = document.createElement("button");
    element.onclick = console.log;
    document.body.append(element);
  }, script);

  const event = await page.waitForFunction(
    () => document.body.textContent?.includes("{") && document.body.textContent
  );
  const actual = JSON.parse(String(event)).isTrusted;

  expect(actual).toBeFalsy();
});
