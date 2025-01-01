<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
=======
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
     "/api": "http://localhost:3001",
  },
  plugins: [react()],
});
>>>>>>> 30632ba7f6d1ffc40b8ae00e695bc1e4622456c2
