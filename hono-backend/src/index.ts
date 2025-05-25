import { Hono } from "hono";
import authRouter from "./routes/auth";
import messageRouter from "./routes/message";
import middlewareRoute from "./routes/middlewareProtected";
import type { AuthType } from "./lib/auth";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono<{ Variables: AuthType }>({
	strict: false,
});

app.use(logger());
app.use(
	"*",
	cors({
		origin: ["http://localhost:3000"],
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["GET", "POST", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	})
);

const api_routes = [authRouter, messageRouter, middlewareRoute]; // Routes that needs to be added /api as their basePath

// Iterating through the routes and setting '/api' as their base path
for (const route of api_routes) {
	app.basePath("/api").route("/", route);
}

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

export default app;

