import { Router, type IRouter } from "express";
import { AdminLoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "wawra-admin-2024";

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Password is required" });
    return;
  }

  if (parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  req.session = req.session ?? {};
  (req.session as Record<string, unknown>).adminAuthenticated = true;

  res.json({ success: true, message: "Logged in successfully" });
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  req.session = req.session ?? {};
  (req.session as Record<string, unknown>).adminAuthenticated = false;
  res.json({ success: true });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const session = req.session as Record<string, unknown> | undefined;
  const authenticated = session?.adminAuthenticated === true;

  if (!authenticated) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  res.json({ authenticated: true, role: "admin" });
});

export default router;
