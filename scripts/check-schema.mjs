import assert from "node:assert/strict";
import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";

const origin = "https://izumo-kampo.clinic";
const organizationId = `${origin}/#organization`;
const blockPattern =
  /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const file = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(file) : [file];
    }),
  );
  return files.flat();
}
function types(node) {
  return [node["@type"] ?? []].flat();
}
async function inspect(value, ids, file) {
  if (Array.isArray(value)) {
    for (const child of value) await inspect(child, ids, file);
    return;
  }
  if (!value || typeof value !== "object") return;
  if (Object.keys(value).length === 1 && value["@id"]) {
    assert(ids.has(value["@id"]), `${file}: undefined @id ${value["@id"]}`);
  }
  const nodeTypes = types(value);
  if (value.availableLanguage) {
    assert(
      nodeTypes.some((type) =>
        [
          "ContactPoint",
          "Course",
          "LodgingBusiness",
          "ServiceChannel",
          "TouristAttraction",
        ].includes(type),
      ),
      `${file}: invalid availableLanguage domain`,
    );
  }
  assert(
    !("publicTransportationAccess" in value),
    `${file}: unsupported publicTransportationAccess`,
  );
  if (nodeTypes.includes("MedicalTherapy"))
    assert(!value.provider, `${file}: MedicalTherapy.provider`);
  if (nodeTypes.includes("VideoObject")) {
    assert(
      !value.contentUrl?.includes("youtube.com/watch"),
      `${file}: watch page used as video bytes`,
    );
    for (const key of ["name", "thumbnailUrl", "uploadDate", "embedUrl"])
      assert(value[key], `${file}: missing video ${key}`);
  }
  if (nodeTypes.includes("MedicalClinic")) {
    assert.equal(
      value.openingHoursSpecification.length,
      2,
      `${file}: clinic hours must cover in-person care`,
    );
    for (const hours of value.openingHoursSpecification) {
      assert(
        !hours.dayOfWeek.some((day) => /Saturday|Sunday/.test(day)),
        `${file}: online hours mixed with physical clinic hours`,
      );
    }
  }
  if (nodeTypes.includes("BreadcrumbList")) {
    assert.deepEqual(
      value.itemListElement.map((item) => item.position),
      value.itemListElement.map((_, i) => i + 1),
      `${file}: breadcrumb positions`,
    );
    for (const item of value.itemListElement)
      assert(
        item.item.startsWith(`${origin}/`),
        `${file}: nonabsolute breadcrumb URL`,
      );
  }
  if (
    nodeTypes.includes("ImageObject") &&
    value.url?.startsWith(`${origin}/`)
  ) {
    await access(path.join("public", value.url.slice(origin.length + 1)));
  }
  for (const child of Object.values(value)) await inspect(child, ids, file);
}
const sources = (await walk("src/pages")).filter((file) =>
  file.endsWith(".astro"),
);
for (const file of sources) {
  const source = await readFile(file, "utf8");
  const blocks = [...source.matchAll(blockPattern)];
  if (/\/blog\/\d+\.astro$/.test(file)) {
    assert.equal(
      blocks.length,
      0,
      `${file}: blog article must not contain JSON-LD`,
    );
    const built = await readFile(
      path.join(
        "dist",
        path.relative("src/pages", file).replace(/\.astro$/, ".html"),
      ),
      "utf8",
    );
    assert.equal(
      [...built.matchAll(blockPattern)].length,
      0,
      `${file}: built blog article contains JSON-LD`,
    );
    continue;
  }
  assert.equal(blocks.length, 1, `${file}: expected one JSON-LD block`);
  const schema = JSON.parse(blocks[0][1]);
  assert.equal(schema["@context"], "https://schema.org");
  const ids = new Set(schema["@graph"].map((node) => node["@id"]));
  assert.equal(
    ids.size,
    schema["@graph"].length,
    `${file}: duplicate graph IDs`,
  );
  assert(ids.has(organizationId), `${file}: missing clinic node`);
  await inspect(schema, ids, file);
  if (!file.endsWith("/index.astro") || file.includes("/blog/")) {
    assert(
      schema["@graph"].some((node) => types(node).includes("BreadcrumbList")),
      `${file}: missing breadcrumbs`,
    );
  }
  const relative = path.relative("src/pages", file);
  const builtPath =
    relative === "blog/index.astro"
      ? "dist/blog.html"
      : path.join("dist", relative.replace(/\.astro$/, ".html"));
  const built = await readFile(builtPath, "utf8");
  const head = built.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)[1];
  const builtBlocks = [...head.matchAll(blockPattern)];
  assert.equal(builtBlocks.length, 1, `${file}: JSON-LD not in built head`);
  assert.deepEqual(
    JSON.parse(builtBlocks[0][1]),
    schema,
    `${file}: schema changed during build`,
  );
}
console.log(
  `Schema checks passed for ${sources.length} pages and their built HTML.`,
);
