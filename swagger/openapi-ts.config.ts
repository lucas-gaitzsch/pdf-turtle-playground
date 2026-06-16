import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: "http://localhost:8000/swagger/doc.json",
  output: "./src/swagger-client",
  plugins: ["@hey-api/client-axios"],
})
