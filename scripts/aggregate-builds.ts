#!/usr/bin/env -S deno run --allow-read --allow-write

import { existsSync } from "https://deno.land/std@0.224.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

const slidesDir = join(Deno.cwd(), "slides");
const distDir = join(Deno.cwd(), "dist");

// Clean and create dist directory
if (existsSync(distDir)) {
	await Deno.remove(distDir, { recursive: true });
}
await Deno.mkdir(distDir, { recursive: true });

// Find all presentation directories
const presentations: string[] = [];
for await (const entry of Deno.readDir(slidesDir)) {
	if (entry.isDirectory) {
		presentations.push(entry.name);
	}
}

// Copy each presentation's dist to root dist
for (const presentation of presentations) {
	const sourceDist = join(slidesDir, presentation, "dist");
	const targetDir = join(distDir, presentation);

	if (existsSync(sourceDist)) {
		await Deno.mkdir(targetDir, { recursive: true });
		await copyDir(sourceDist, targetDir);
		console.log(`✅ Copied ${presentation} build to dist/${presentation}`);
	} else {
		console.log(`⚠️  No dist folder found for ${presentation}`);
	}
}

// Generate index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Talks - Presentation Index</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 40px;
    }
    .presentation {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .presentation:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .presentation h3 {
      margin: 0 0 10px 0;
      color: #495057;
    }
    .presentation a {
      color: #007bff;
      text-decoration: none;
      font-weight: 500;
    }
    .presentation a:hover {
      text-decoration: underline;
    }
    .no-presentations {
      text-align: center;
      color: #6c757d;
      font-style: italic;
    }
  </style>
</head>
<body>
  <h1>📊 Presentations</h1>
  ${
		presentations.length > 0
			? presentations
					.map(
						(presentation) => `
  <div class="presentation">
    <h3>${presentation.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</h3>
    <a href="./${presentation}/">View Presentation →</a>
  </div>`,
					)
					.join("")
			: '<div class="no-presentations">No presentations found</div>'
	}
</body>
</html>`;

await Deno.writeTextFile(join(distDir, "index.html"), indexHtml);
console.log("✅ Generated index.html");

console.log(
	`\n🎉 Successfully aggregated ${presentations.length} presentation(s) to dist/`,
);

// Helper function to copy directories recursively
async function copyDir(src: string, dest: string): Promise<void> {
	for await (const entry of Deno.readDir(src)) {
		const srcPath = join(src, entry.name);
		const destPath = join(dest, entry.name);

		if (entry.isDirectory) {
			await Deno.mkdir(destPath, { recursive: true });
			await copyDir(srcPath, destPath);
		} else {
			await Deno.copyFile(srcPath, destPath);
		}
	}
}
