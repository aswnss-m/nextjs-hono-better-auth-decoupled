import { betterAuth } from "better-auth";
import { Role } from "../generated/prisma";
// Adapter to use prisma orm
import { prismaAdapter } from "better-auth/adapters/prisma";
// The prisma client we creater to control the db
import prisma from "./prismaClient";

export const auth = betterAuth({
	// Provide the database adapter prisma here
	database: prismaAdapter(prisma, {
		provider: "postgresql", // specify the db here
	}),

	// Authentication methods
	emailAndPassword: {
		enabled: true,
	},

	//To setup cross domain cookies
	advanced: {
		// This will enable cookie passing and checking across domains
		defaultCookieAttributes: {
			sameSite: "none",
			httpOnly: true,
			secure: true,
			partitioned: true,
		},
	},

	// Enable cookie cache to avoid hitting db to get session each time
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // in seconds (5min)
		},
	},

	//
	user: {
		additionalFields: {
			role: {
				type: "string",
				enum: Object.keys(Role),
				defaultValue: Role.USER,
				required: false, // Check the note below to know why I kept this false
			},
		},
	},
});

// Extract the session and user type inorder to use them in our routes
export type AuthType = {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};
