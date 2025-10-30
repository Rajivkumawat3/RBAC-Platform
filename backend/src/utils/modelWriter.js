
const fs = require('fs-extra');
const path = require('path');

const modelsDir = path.join(__dirname, '../../models');

async function ensureModelsDir() {
  await fs.ensureDir(modelsDir);
}

function modelFilePath(modelName) {
  return path.join(modelsDir, `${modelName}.json`);
}

async function writeModelFile(modelDef) {
  await ensureModelsDir();
  const p = modelFilePath(modelDef.name);
  await fs.writeJson(p, modelDef, { spaces: 2 });
  return p;
}

async function readAllModelFiles() {
  await ensureModelsDir();
  const files = await fs.readdir(modelsDir);
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  const result = [];
  for (const f of jsonFiles) {
    result.push(await fs.readJson(path.join(modelsDir, f)));
  }
  return result;
}

module.exports = { writeModelFile, readAllModelFiles, modelFilePath };
