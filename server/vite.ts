import { type Express } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import net from "net";

const viteLogger = createLogger();

// Функция для поиска свободного порта
async function findFreePort(startPort: number = 24678): Promise<number> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, "0.0.0.0", () => {
      const port = (server.address() as net.AddressInfo).port;
      server.close(() => {
        resolve(port);
      });
    });
    server.on("error", () => {
      resolve(findFreePort(startPort + 1));
    });
  });
}

export async function setupVite(server: Server, app: Express) {
  // Получаем свободный порт для HMR
  const hmrPort = await findFreePort();
  const host = process.env.HOST || "0.0.0.0";
  
  const serverOptions = {
    middlewareMode: true,
    hmr: { 
      protocol: "ws",
      host: undefined, // Позволяет браузеру использовать свой хост
      port: hmrPort,   // Автоматически найденный свободный порт
    },
    allowedHosts: "all",
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        // Игнорируем ошибки про WebSocket порт - он будет автоматически переназначен
        if (!msg.includes("WebSocket") && !msg.includes("port")) {
          viteLogger.error(msg, options);
          process.exit(1);
        }
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("/{*path}", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
