// ビルド後処理: dist 内の HTML の絶対パス（/clinic.html, /wp-content/..., / など）を
// 各 HTML ファイルの階層に応じた相対パス（./ や ../）へ変換する。
// → ローカルでファイル直開き（file://）やサブディレクトリ配信でも崩れないようにする。
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DIST = "dist";

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

// dist からの深さ（サブディレクトリ数）に応じた接頭辞を返す
function prefixOf(file) {
  const depth = path.relative(DIST, file).split(path.sep).length - 1;
  return depth === 0 ? "./" : "../".repeat(depth);
}

// 絶対パス（先頭 /）→ 相対パス
function toRel(abs, prefix) {
  if (abs === "/") return prefix + "index.html"; // トップ
  return prefix + abs.replace(/^\//, "");
}

const files = await walk(DIST);
for (const file of files) {
  const prefix = prefixOf(file);
  let html = await readFile(file, "utf8");

  // href / src / action="/..."（// で始まるプロトコル相対は除外）
  html = html.replace(/\b(href|src|action)="(\/[^"]*)"/g, (m, attr, val) =>
    val.startsWith("//") ? m : `${attr}="${toRel(val, prefix)}"`,
  );

  // srcset="/a.jpg 1024w, /b.jpg 300w"（カンマ区切りの各URL）
  html = html.replace(/\bsrcset="([^"]*)"/g, (m, val) => {
    const out = val.split(",").map((part) => {
      const seg = part.trim().split(/\s+/);
      if (seg[0].startsWith("/") && !seg[0].startsWith("//"))
        seg[0] = toRel(seg[0], prefix);
      return seg.join(" ");
    });
    return `srcset="${out.join(", ")}"`;
  });

  await writeFile(file, html);
}

console.log(`[relativize] ${files.length} HTML files → relative paths`);
