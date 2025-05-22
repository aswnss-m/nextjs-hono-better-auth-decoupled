import { Hono } from "hono";
import authRouter from "./routes/auth";
import type { AuthType } from "./lib/auth";

const app = new Hono<{ Variables: AuthType }>({
	strict: false,
});

// const api_routes = [authRouter];

// for (const route of api_routes) {
// 	app.basePath("/api").route("/", route);
// }

app.route("/api", authRouter);
app.get("/", (c) => {
	return c.text("Hello Hono!");
});

export default app;

