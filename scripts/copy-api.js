const fs = require('node:fs');
const path = require('node:path');

const sourceDir = path.resolve(__dirname, '..', 'api');
const targetDir = path.resolve(__dirname, '..', 'dist', 'api');
const iconsDir = path.resolve(__dirname, '..', 'icons');
const targetIconsDir = path.resolve(__dirname, '..', 'dist', 'icons');
const targetNodeIconsDir = path.resolve(__dirname, '..', 'dist', 'nodes', 'icons');

if (!fs.existsSync(sourceDir)) {
	console.warn('API source directory not found:', sourceDir);
	process.exit(0);
}

fs.mkdirSync(targetDir, { recursive: true });

for (const file of fs.readdirSync(sourceDir)) {
	if (!file.endsWith('.json')) continue;
	fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
}

console.log('Copied Infomaniak API specs to dist/api');

if (fs.existsSync(iconsDir)) {
	fs.mkdirSync(targetIconsDir, { recursive: true });
	fs.mkdirSync(targetNodeIconsDir, { recursive: true });
	for (const file of fs.readdirSync(iconsDir)) {
		const source = path.join(iconsDir, file);
		fs.copyFileSync(source, path.join(targetIconsDir, file));
		fs.copyFileSync(source, path.join(targetNodeIconsDir, file));
	}
	console.log('Copied icons to dist/icons and dist/nodes/icons');
}
