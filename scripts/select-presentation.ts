#!/usr/bin/env -S deno run --allow-read --allow-run

import { readdir } from "node:fs/promises";

const slidesDir = "slides";
const command = Deno.args[0] || "dev";
const projectArg = Deno.args[1];

async function getAvailablePresentations(): Promise<string[]> {
	try {
		const entries = await readdir(slidesDir, { withFileTypes: true });
		return entries
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name)
			.sort();
	} catch (error) {
		console.error("Error reading slides directory:", error);
		Deno.exit(1);
	}
}

async function selectPresentation(presentations: string[]): Promise<string> {
	if (presentations.length === 0) {
		console.error("No presentations found in slides/ directory");
		Deno.exit(1);
	}

	if (presentations.length === 1) {
		return presentations[0];
	}

	console.log("Available presentations:");
	presentations.forEach((name, index) => {
		console.log(`  ${index + 1}. ${name}`);
	});

	while (true) {
		const input = prompt("\nSelect presentation (number or name):");

		if (!input) {
			console.log("Cancelled");
			Deno.exit(0);
		}

		// Try to parse as number
		const num = parseInt(input, 10);
		if (!Number.isNaN(num) && num >= 1 && num <= presentations.length) {
			return presentations[num - 1];
		}

		// Try to match by name
		const match = presentations.find((name) =>
			name.toLowerCase().includes(input.toLowerCase()),
		);
		if (match) {
			return match;
		}

		console.log("Invalid selection. Please try again.");
	}
}

async function runCommand(presentation: string, command: string) {
	console.log(`Running '${command}' for presentation: ${presentation}`);

	const process = new Deno.Command("pnpm", {
		args: ["--filter", presentation, command],
		stdout: "inherit",
		stderr: "inherit",
	});

	const { code } = await process.output();
	Deno.exit(code);
}

async function main() {
	const presentations = await getAvailablePresentations();

	let selected: string;

	if (projectArg) {
		// Check if provided project exists
		const match = presentations.find(
			(name) =>
				name === projectArg ||
				name.toLowerCase().includes(projectArg.toLowerCase()),
		);

		if (match) {
			selected = match;
		} else {
			console.error(`Project '${projectArg}' not found.`);
			console.log("Available presentations:");
			presentations.forEach((name) => console.log(`  - ${name}`));
			Deno.exit(1);
		}
	} else {
		selected = await selectPresentation(presentations);
	}

	await runCommand(selected, command);
}

if (import.meta.main) {
	main();
}
