import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import UnoCSS from '@unocss/svelte-scoped/preprocess';

export default {
    // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
    // for more information about preprocessors
    preprocess: [
        vitePreprocess(),
        UnoCSS({
            combine: process.env.NODE_ENV === 'production',
        }),
    ],
};
