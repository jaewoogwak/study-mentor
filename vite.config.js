import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/',
    'import.meta.env.VITE_APP_API_URL': 'http://13.124.221.128:5000',
    'import.meta.env.VITE_APP_API_KEY': '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',
    

});
