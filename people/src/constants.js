// Import fs and path modules using ES Module syntax
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Convert the __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import jsonData from './MemberList.json' assert { type: 'json' };

const names = [];
const team = [];
const title = [];
const urls = [];

let i = 0;

jsonData.forEach(item => {
  i += 1;
  names.push(`${item["First Name"]} ${item["Last Name"]}`);
  team.push(item["Position"]);

  // Your conditional logic here is fine, just ensure it matches your exact requirements
  if (i <= 2) {
    title.push("Producers");
  } else if (i <= 31) {
    title.push("Production");
  } else if (i <= 38) {
    title.push("Cinematography");
  } else if (i <= 60) {
    title.push("Creative");
  } else if (i <= 69) {
    title.push("PR");
  } else if (i <= 99) {
    title.push("Design");
  } else if (i <= 121) {
    title.push("Model");
  } else if (i <= 131) {
    title.push("Hair/Makeup");
  } else if (i <= 181) {
    title.push("Dance");
  } else {
    title.push("N/A");
  }

  urls.push(i);
});

const content = `
export const names = ${JSON.stringify(names)};
export const team = ${JSON.stringify(team)};
export const title = ${JSON.stringify(title)};
export const urls = ${JSON.stringify(urls)};
`;

fs.writeFileSync(path.resolve(__dirname, 'newConstants.js'), content);
