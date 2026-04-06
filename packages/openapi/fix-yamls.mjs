import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const specsDir = path.join(__dirname, "specs");

const products = [
  "automate",
  "app-automate",
  "js-testing",
  "screenshots",
  "local-testing",
  "local-testing-binary",
];

// Read shared.yml to get servers and securitySchemes
const sharedPath = path.join(specsDir, "shared.yml");
const sharedYaml = yaml.load(await fs.readFile(sharedPath, "utf8"));

const servers = sharedYaml.servers;
const securitySchemes = sharedYaml.components.securitySchemes;

// Update each product YAML
for (const product of products) {
  const filePath = path.join(specsDir, `${product}.yml`);
  const content = yaml.load(await fs.readFile(filePath, "utf8"));
  
  // Set servers from shared
  content.servers = servers;
  
  // Ensure components.securitySchemes exists
  if (!content.components) content.components = {};
  content.components.securitySchemes = securitySchemes;
  
  // Write back
  await fs.writeFile(filePath, yaml.dump(content, { lineWidth: -1 }));
  console.log(`✓ Fixed ${product}.yml`);
}

console.log("✓ All YAML files fixed");
