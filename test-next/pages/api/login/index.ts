// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { LoginResponse, User, UserLogin } from "../../../types/user";
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
			const user: User = result[0];
			//Set JWT token
			delete user.password;
			delete user.token;
			const token = jwt.sign(user, process.env.JWT_SECRET || "", {
				expiresIn: "6h",
			});
			//Save JWT Token
			try {
				//This can still be improved depending on the backend's error handling
				await fetch("http://localhost:8081/users/" + user.id, {
					method: "PATCH",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ token: token }),
				});
				res.status(200).json({
					error: false,
					message: "Login successful.",
					token: token,
				});
			} catch (e: any) {
				res.status(200).json({
					error: true,
					message: e.toString(),
				});
			}
		} else {
			res.status(200).json({
				error: true,
				message: "Username or password is incorrect.",
			});
		}
	} else {
		res.status(200).json({
			error: true,
			message: "Method not valid.",
		});
	}
}
