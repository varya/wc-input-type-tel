'use strict';

import fs from "fs";
import path from "path";
import format from "date-format";

import { version as newVersion } from "../package.json";

process.env.PWD = process.cwd();
const APP_ROOT = process.env.PWD;

const CHANGELOG_LATEST_PATH = path.resolve(APP_ROOT, "./CHANGELOG_LATEST.md");
const CHANGELOG_PATH = path.resolve(APP_ROOT, "./CHANGELOG.md");

const changelogLatestText = fs.readFileSync(CHANGELOG_LATEST_PATH);
const changelogText = fs.readFileSync(CHANGELOG_PATH);

const newChangelogLatestText = `## ${newVersion} @ ${format("MM/dd/yyyy", new Date())}\n\n${changelogLatestText}`;

const newChangelogText = `${newChangelogLatestText}\n\n${changelogText}`;

fs.writeFileSync(CHANGELOG_LATEST_PATH, newChangelogLatestText);
fs.writeFileSync(CHANGELOG_PATH, newChangelogText);