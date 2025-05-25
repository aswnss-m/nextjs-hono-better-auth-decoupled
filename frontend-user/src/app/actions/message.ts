"use server";
import { cookies } from "next/headers";
export async function getProtectedMessage() {
	const cookie = await cookies();
	const res = await fetch("http://localhost:5000/api/message", {
		method: "POST",
		headers: {
			cookie: cookie.toString(), // this will set the cookies from the browser , used to authenticate
		},
	});

	if (!res.ok) {
		console.log("Response was not successfull");
		console.log("Error : ", res.status);
		console.log("ErrorMessage : ", res.statusText);
		return {
			data: {},
			error: "Response was not successfull",
		};
	}

	const resjson = await res.json();
	return {
		data: resjson,
		error: null,
	};
}
