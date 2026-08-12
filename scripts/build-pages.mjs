import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import sharp from "sharp";

const projectRoot = resolve(import.meta.dirname, "..");
const outputRoot = join(projectRoot, "_site");
const sourceImages = join(projectRoot, "public", "images");
const outputImages = join(outputRoot, "public", "images");
const recommendedBytes = 5 * 1024 * 1024;
const maximumBytes = 20 * 1024 * 1024;
const responsiveWidths = [960, 1600, 2560];
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function listImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const images = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "generated") images.push(...await listImages(path));
    } else if (supportedExtensions.has(extname(entry.name).toLowerCase())) {
      images.push(path);
    }
  }

  return images;
}

function displayDimensions(metadata) {
  if (!metadata.width || !metadata.height) throw new Error("이미지 크기를 확인할 수 없습니다.");
  const rotated = metadata.orientation && metadata.orientation >= 5 && metadata.orientation <= 8;
  return rotated
    ? { width: metadata.height, height: metadata.width }
    : { width: metadata.width, height: metadata.height };
}

async function optimizeFallback(source, destination) {
  const extension = extname(source).toLowerCase();
  let pipeline = sharp(source).rotate().resize({ width: 2560, withoutEnlargement: true });

  if (extension === ".jpg" || extension === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true });
  } else if (extension === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, quality: 90 });
  } else {
    pipeline = pipeline.webp({ quality: 82 });
  }

  await mkdir(dirname(destination), { recursive: true });
  await pipeline.toFile(destination);
}

async function buildVariants(source, relativeImage, dimensions) {
  const relativeStem = relativeImage.slice(0, -extname(relativeImage).length);
  const widths = [...new Set(responsiveWidths.map((width) => Math.min(width, dimensions.width)))];
  const variants = [];

  for (const width of widths) {
    const relativeOutput = join("generated", `${relativeStem}-${width}.webp`);
    const destination = join(outputImages, relativeOutput);
    await mkdir(dirname(destination), { recursive: true });
    await sharp(source)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(destination);
    variants.push({
      src: `/images/${relativeOutput.split(sep).join("/")}`,
      width,
      height: Math.round((dimensions.height / dimensions.width) * width),
    });
  }

  return variants;
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(join(outputRoot, "content"), { recursive: true });
await mkdir(join(outputRoot, "app"), { recursive: true });
await cp(join(projectRoot, "index.html"), join(outputRoot, "index.html"));
await cp(join(projectRoot, "site.js"), join(outputRoot, "site.js"));
await cp(join(projectRoot, ".nojekyll"), join(outputRoot, ".nojekyll"));
await cp(join(projectRoot, "app", "globals.css"), join(outputRoot, "app", "globals.css"));
await cp(join(projectRoot, "public"), join(outputRoot, "public"), { recursive: true });
await cp(join(projectRoot, "content", "site.json"), join(outputRoot, "content", "site.json"));

const imageFiles = await listImages(sourceImages);
const imageInfo = new Map();

for (const source of imageFiles) {
  const relativeImage = relative(sourceImages, source);
  const file = await stat(source);
  if (file.size > maximumBytes) {
    throw new Error(`${relativeImage}: 20MB를 넘는 이미지는 배포할 수 없습니다.`);
  }
  if (file.size > recommendedBytes) {
    console.warn(`경고: ${relativeImage}는 5MB를 넘습니다. 업로드 전에 줄이는 것을 권장합니다.`);
  }

  const dimensions = displayDimensions(await sharp(source).metadata());
  imageInfo.set(relativeImage.split(sep).join("/"), { source, dimensions });
  await optimizeFallback(source, join(outputImages, relativeImage));
}

const sourceContent = JSON.parse(
  await readFile(join(projectRoot, "content", "works.json"), "utf8"),
);
const works = [];

for (const work of sourceContent.works) {
  const relativeImage = work.image.replace(/^\/images\//, "");
  const info = imageInfo.get(relativeImage);
  if (!info) throw new Error(`${work.title}: ${work.image} 파일을 찾을 수 없습니다.`);

  works.push({
    ...work,
    ...info.dimensions,
    variants: await buildVariants(info.source, relativeImage, info.dimensions),
  });
}

await writeFile(
  join(outputRoot, "content", "works.json"),
  `${JSON.stringify({ works }, null, 2)}\n`,
);

console.log(`${imageFiles.length}개 원본을 최적화하고 ${works.length}개 작품의 반응형 이미지를 생성했습니다.`);
