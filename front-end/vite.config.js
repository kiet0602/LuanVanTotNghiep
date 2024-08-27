import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000, // Thay đổi cổng thành 3001 hoặc cổng bạn muốn
  },
});
