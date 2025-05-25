import { Hono } from "hono";
import type { AuthType } from "../lib/auth";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = new Hono<{ Variables: AuthType }>({
	strict: false,
})
	.basePath("/protected")
	.use(authMiddleware); // add the middleware to all the routes in this

router.on(["GET", "POST"], "/", (c) => {
	//you can get the user data like
	const user = c.get("user");
	if (!user) {
		return c.json({
			error: "user not found",
		});
	}

	console.log(user);
	return c.json({
		data: {
			message: "this route is protected by middleware",
		},
	});
});

export default router;
