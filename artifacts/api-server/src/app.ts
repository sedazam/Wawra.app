import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";
import path from "path";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET ?? "wawra-secret"));

// Simple cookie-based session
app.use((req, _res, next) => {
  const signedCookies = req.signedCookies as Record<string, string>;
  try {
    const raw = signedCookies["wawra_session"];
    req.session = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    req.session = {};
  }
  next();
});

// Session save middleware
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (req.session && Object.keys(req.session).length > 0) {
      res.cookie("wawra_session", JSON.stringify(req.session), {
        signed: true,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
    return originalJson(body);
  };
  next();
});

// Serve uploaded static files
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");
app.use("/api/static", express.static(UPLOAD_DIR));

app.use("/api", router);

export default app;
