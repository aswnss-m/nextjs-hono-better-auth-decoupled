import { Hono } from "hono";
import { auth, type AuthType } from "../lib/auth";

const router = new Hono<{ Variables: AuthType }>({
	strict: false,
}).basePath("/message");

router.get("/", (c) => {
	return c.json({
		data: {
			message: "Message route make post request with auth",
		},
	});
});

router.post("/", async (c) => {
	// Checking the session

	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session || !session.user) {
		return c.json({
			data: {
				message: "Not Authenticated",
			},
		});
	}

	return c.json({
		data: {
			message: "Message route make post request with auth",
		},
	});
});

export default router;
