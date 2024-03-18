
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
    title.push("Executive");
    urls.push(`people/src/assets/headshots/Executive_${item["First Name"]}${item["Last Name"]}.jpg`);
  } else if (i <= 27) {
    title.push("Production");
    urls.push(`people/src/assets/headshots/Production_${item["First Name"]}${item["Last Name"]}.jpg`);
  } else if (i <= 30) {
    title.push("Cinematography");
    urls.push(`people/src/assets/headshots/Cinematography_${item["First Name"]}${item["Last Name"]}.jpg`);
  } else if (i <= 62) {
    title.push("Creative");
    urls.push(`people/src/assets/headshots/Creative_${item["First Name"]}${item["Last Name"]}.jpg`);
  } else if (i <= 68) {
    title.push("PR");
    urls.push(`people/src/assets/headshots/PR_${item["First Name"]}${item["Last Name"]}.jpg`);
  } else if (i <= 94) {
    title.push("Design");
    urls.push(`people/src/assets/headshots/Design_${item["First Name"]}${item["Last Name"]}.png`);
  } else if (i <= 114) {
    title.push("Model");
    urls.push(`people/src/assets/headshots/Model_${item["First Name"]}${item["Last Name"]}.jpg`);
  } else if (i <= 122) {
    title.push("Hair/Makeup");
    urls.push(`people/src/assets/headshots/Hair_Makeup_${item["First Name"]}${item["Last Name"]}.jpeg`);
  } else if (i <= 168) {
    title.push("Dance");
    urls.push(`people/src/assets/headshots/Dance_${item["First Name"]}${item["Last Name"]}.jpg`);
  } else {
    title.push("N/A");
    urls.push(`people/src/assets/headshots/easteregg.jpg`);
  }

});

const content = `
export const names = ${JSON.stringify(names)};
export const team = ${JSON.stringify(team)};
export const title = ${JSON.stringify(title)};
export const urls = ${JSON.stringify(urls)};
`;

fs.writeFileSync(path.resolve(__dirname, 'newConstants.js'), content);
