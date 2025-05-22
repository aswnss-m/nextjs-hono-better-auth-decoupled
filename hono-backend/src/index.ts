import { Hono } from "hono";
import authRouter from "./routes/auth";
import type { AuthType } from "./lib/auth";
import { cors } from "hono/cors";

const app = new Hono<{ Variables: AuthType }>({
	strict: false,
});

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

// const api_routes = [authRouter];

// for (const route of api_routes) {
// 	app.basePath("/api").route("/", route);
// }

app.route("/api", authRouter);
app.get("/", (c) => {
	return c.text("Hello Hono!");
});

export default app;

