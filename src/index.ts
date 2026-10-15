#!/usr/bin/env node

import { copyFile, readdir } from 'fs/promises';
import { join, extname } from 'path';
import { Command } from 'commander';
import { cwd } from 'process';

const SUB_EXTS = new Set(['.srt', '.ass', '.ssa', '.vtt', '.sub', '.idx', '.sup']);

const program = new Command();

program
  .version('1.0.1')
  .description('Copy subtitles from "Subs" folder')
  .option('-f, --folder <path>', 'Show folder containing Subs/', cwd())
  .parse(process.argv);

const options = program.opts<{ folder: string }>();

function isSubtitleFile(name: string): boolean {
  return SUB_EXTS.has(extname(name).toLowerCase());
}

function isEnglishSubtitle(name: string): boolean {
  return name.toLowerCase().includes('english') || name.toLowerCase().includes('.eng.');
}

async function main() {
  const folder = options.folder;
  const subFolder = join(folder, 'Subs');
  const entries = await readdir(subFolder, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Nested layout: Subs/<episode>/2_English.srt
      const subtitles = (await readdir(join(subFolder, entry.name))).filter(
        (s) => isSubtitleFile(s) && isEnglishSubtitle(s),
      );
      for (const sub of subtitles) {
        const dest = join(folder, `${entry.name}${sub}`);
        await copyFile(join(subFolder, entry.name, sub), dest);
        console.log(dest);
      }
      continue;
    }

    if (entry.isFile() && isSubtitleFile(entry.name)) {
      // Flat layout: Subs/<episode>.srt (or .idx/.sub) — names already match videos
      const dest = join(folder, entry.name);
      await copyFile(join(subFolder, entry.name), dest);
      console.log(dest);
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
