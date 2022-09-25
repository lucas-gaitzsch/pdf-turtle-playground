// eslint-disable-next-line @typescript-eslint/no-var-requires
const { codegen } = require("swagger-axios-codegen")

codegen({
  methodNameMode: "path",
  //source: require('./swagger.json'),
  remoteUrl: "http://localhost:8000/swagger/doc.json",
  outputDir: "./src/swagger-client",
  strictNullChecks: true,
  modelMode: "interface",
  extendGenericType: ["JsonResult"],
  sharedServiceOptions: true,
})
