#!/usr/bin/env node

import { copyFile, readdir } from 'fs/promises';
import { join } from 'path';
import { Command } from 'commander';
import { cwd } from 'process';

const program = new Command();

program
  .version('1.0.0')
  .description('Copy subtitles from "Subs" folder')
  .option('--folder', 'File to copy subtitles to', cwd())
  .parse(process.argv);

const options = program.opts<{ folder: string }>();

async function main() {
  const subFolder = join(options.folder, 'Subs');
  const dirs = await readdir(subFolder);
  for (const dir of dirs) {
    const subtitles = (await readdir(join(subFolder, dir))).filter((s) =>
      s.toLowerCase().includes('english'),
    );
    for (const sub of subtitles) {
      const createFileName = join(options.folder, `${dir}${sub}`);
      const file = join(subFolder, dir, sub);
      await copyFile(file, createFileName);
      console.log(createFileName);
    }
  }
}

main();
