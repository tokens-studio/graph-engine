import fs from 'fs/promises';
import path from 'path';


async function extractVersion() {
    const raw = await fs.readFile('./package.json');
    const packageJson = JSON.parse(raw);
    const version = packageJson.version;
    const filePath = path.join( 'src', 'data', 'version.ts');
    const fileContent = `export const version = '${version}';\n`;

    await fs.writeFile(filePath, fileContent);
    console.log(`Updated version to ${version} in ${filePath}`);

}


extractVersion();
