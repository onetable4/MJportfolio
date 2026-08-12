import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the portfolio from editable content", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Kobe Han — Photographer<\/title>/i);
  assert.match(html, /Between Red Rocks/);
  assert.match(html, /사람과 장소 사이에 잠시 머무는 빛을 기록합니다/);
  assert.match(html, /hello@kobehan\.photo/);
});

test("Pages CMS content references valid portfolio images", async () => {
  const [siteText, worksText, cmsConfig] = await Promise.all([
    readFile(new URL("../content/site.json", import.meta.url), "utf8"),
    readFile(new URL("../content/works.json", import.meta.url), "utf8"),
    readFile(new URL("../.pages.yml", import.meta.url), "utf8"),
  ]);
  const site = JSON.parse(siteText);
  const { works } = JSON.parse(worksText);

  assert.equal(site.name, "Kobe Han");
  assert.ok(Array.isArray(works) && works.length > 0);
  assert.match(cmsConfig, /path: content\/works\.json/);
  assert.match(cmsConfig, /path: content\/site\.json/);

  for (const work of works) {
    assert.ok(work.title);
    assert.ok(["portrait", "landscape", "wide"].includes(work.layout));
    assert.equal(typeof work.published, "boolean");
    assert.equal("width" in work, false);
    assert.equal("height" in work, false);
    assert.match(work.image, /^\/images\//);
    await access(new URL(`../public${work.image}`, import.meta.url));
  }
});

test("GitHub Pages build includes responsive image variants", async () => {
  const output = JSON.parse(
    await readFile(new URL("../_site/content/works.json", import.meta.url), "utf8"),
  );

  assert.ok(Array.isArray(output.works) && output.works.length > 0);
  for (const work of output.works) {
    assert.ok(work.width > 0 && work.height > 0);
    assert.ok(Array.isArray(work.variants) && work.variants.length > 0);
    for (const variant of work.variants) {
      assert.match(variant.src, /^\/images\/generated\/.+\.webp$/);
      await access(new URL(`../_site/public${variant.src}`, import.meta.url));
    }
  }
});
