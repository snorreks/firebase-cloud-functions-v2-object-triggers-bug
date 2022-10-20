import { build } from 'esbuild';


await build({
	banner: {
		js: "import{createRequire}from'module';const require=createRequire(import.meta.url);",
	},
	bundle: true,
	format: 'esm',
	minify: false,
	sourcemap: true,
	treeShaking: true,
	platform: 'node',
	target: 'node16',
	entryPoints: ['./src/index.ts'],
	outfile: 'functions/index.js',
});