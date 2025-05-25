import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: "http://localhost:5000/api/auth",
	plugins: [
		inferAdditionalFields({
			user: {
				role: {
					type: "string",
					required: false,
				},
			},
		}),
	],
});
