'use strict';

import { execSync, spawn } from "child_process"
import fs from "fs";
import path from "path";

const EDITOR = process.env.EDITOR || "notepad";

process.env.PWD = process.cwd();
const APP_ROOT = process.env.PWD;

const CHANGELOG_LATEST_PATH = path.resolve(APP_ROOT, "./CHANGELOG_LATEST.md");

const changelogText = execSync("git log $(git describe --tags --abbrev=0)..HEAD --merges --pretty=format:\"* %b\"");

fs.writeFileSync(CHANGELOG_LATEST_PATH, changelogText);

let editChangelog = spawn(EDITOR, [CHANGELOG_LATEST_PATH], {
  stdio: "inherit"
});

editChangelog.on("exit", function (e, code) {
  console.log("saved");
});