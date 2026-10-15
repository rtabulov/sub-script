#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const path_1 = require("path");
const commander_1 = require("commander");
const process_1 = require("process");
const program = new commander_1.Command();
program
    .version('1.0.0')
    .description('Copy subtitles from "Subs" folder')
    .option('--folder', 'File to copy subtitles to', (0, process_1.cwd)())
    .parse(process.argv);
const options = program.opts();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const subFolder = (0, path_1.join)(options.folder, 'Subs');
        const dirs = yield (0, promises_1.readdir)(subFolder);
        for (const dir of dirs) {
            const subtitles = (yield (0, promises_1.readdir)((0, path_1.join)(subFolder, dir))).filter((s) => s.toLowerCase().includes('english'));
            for (const sub of subtitles) {
                const createFileName = (0, path_1.join)(options.folder, `${dir}${sub}`);
                const file = (0, path_1.join)(subFolder, dir, sub);
                yield (0, promises_1.copyFile)(file, createFileName);
                console.log(createFileName);
            }
        }
    });
}
main();
//# sourceMappingURL=index.js.map