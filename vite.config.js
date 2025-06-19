import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
	plugins: [svelte()],
	base: '/simple-timer',
	build: {
		sourcemap: true,
		rollupOptions: {
			treeshake: true,
		},
	},
});
