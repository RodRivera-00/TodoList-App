// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { LoginResponse, UserLogin } from "../../../types/user";
import jwt from "jsonwebtoken";
export default async function Login(
	req: NextApiRequest,
	res: NextApiResponse<LoginResponse>
) {
	//Check if exists on database
	if (
		req.method === "POST" &&
		req.headers["content-type"] === "application/json"
	) {
		const userData: UserLogin = req.body;
		const checkLogin = await fetch(
			"http://localhost:8081/users/?" +
				new URLSearchParams({
					username: userData.username,
					password: userData.password,
				})
		);
		const result = await checkLogin.json();
		if (result.length === 1) {
			//Set JWT token
			const token = jwt.sign(result[0], process.env.JWT_SECRET || "", {
				expiresIn: "6h",
			});
			res.status(200).json({
				error: false,
				message: "Login successful.",
				token: token,
			});
		} else {
			res.status(200).json({
				error: true,
				message: "Username or password is incorrect.",
			});
		}
		console.log(result);
	} else {
		res.status(200).json({
			error: true,
			message: "Method not valid.",
		});
	}
}
