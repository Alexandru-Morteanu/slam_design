import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { spawn } from "child_process";

const app = new Elysia();
app.use(cors());
app
  .post("/", ({ body }: any) => {
    return new Promise((resolve, reject) => {
      try {
        const a = body.buffer;
        const child = spawn("python3", ["py.py"]);
        const dataToSend = a.join(",");
        child.stdin.write(dataToSend);
        child.stdin.end();
        let outputData: any;
        child.stdout.on("data", (data) => {
          const lines = data.toString().split("\n");
          console.log(lines);
          lines.forEach((line: any) => {
            if (line.includes("True") || line.includes("False")) {
              outputData = line.trim();
            }
          });
        });
        child.stderr.on("data", (data) => {
          outputData = data.toString();
        });
        child.on("close", (code) => {
          console.log(outputData);
          resolve(outputData);
        });
      } catch {
        console.error("error");
        reject("error");
      }
    });
  })
  .listen(8088);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
