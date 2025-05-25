import { auth } from "../lib/auth";
import type { Context, Next } from "hono";

// Use this authMiddleware to check the presence of session from request headers and return 401 if not
export const authMiddleware = async (c: Context, next: Next) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});
	if (!session || !session.user) {
		c.set("session", null);
		c.set("user", null);
		return c.json({ data: null, error: "Unauthorized" }, 401);
	}

	// Attach session and user to context for route access
	c.set("session", session.session);
	c.set("user", session.user);

	return next();
};
