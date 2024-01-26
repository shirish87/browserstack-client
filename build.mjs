import SwaggerParser from '@apidevtools/swagger-parser';
import fs from "node:fs";
import path from "node:path";
import openapiTS, { astToString } from "openapi-typescript";
import ts from "typescript";

const BLOB = ts.factory.createIdentifier("Blob"); // `Blob`
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull()); // `null`

const dirOutput = './src/generated';

const main = async () => {
  const api = await SwaggerParser.bundle('./openapi.yml');
  await SwaggerParser.validate(api);
  await fs.promises.mkdir(dirOutput, { recursive: true });
  await fs.promises.writeFile(path.join(dirOutput, 'openapi.json'), JSON.stringify(api, null, 2));

  const ast = await openapiTS(new URL("./openapi.yml", import.meta.url), {
    transform(schemaObject) {
      if (schemaObject.format === "binary") {
        return schemaObject.nullable
          ? ts.factory.createUnionTypeNode([BLOB, NULL])
          : BLOB;
      }
    },
  });

  const contents = astToString(ast);
  fs.promises.writeFile(path.join(dirOutput, 'openapi.ts'), contents);
};

main();
