const SwaggerParser = require('@apidevtools/swagger-parser');
const { writeFile, mkdir } = require('fs/promises');
const path = require('path');

const dirRoot = __dirname;
const dirDist = path.join(__dirname, 'src', 'generated');

const main = async () => {
  const api = await SwaggerParser.bundle(path.join(dirRoot, 'openapi.yml'));
  await SwaggerParser.validate(api);
  await mkdir(dirDist, { recursive: true });
  await writeFile(path.join(dirDist, 'openapi.json'), JSON.stringify(api, null, 2));
};

main();
