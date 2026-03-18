import { defineConfig } from "vite"
import path from "path"
import browsePlugins from "./vite-plugin"

export default defineConfig({
  plugins: browsePlugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react-router", "@evenrealities/even_hub_sdk", "@jappyjan/even-better-sdk", "upng-js"],
  },
})
