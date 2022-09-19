// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { HomeResponse, Token, User } from "../../../types/user";
import jwt from "jsonwebtoken";
export default async function Home(
	req: NextApiRequest,
	res: NextApiResponse<HomeResponse>
) {
	//Check if exists on database
	if (req.method === "GET") {
		if (req.headers.authorization) {
			const userToken: Token = {
				token: req.headers.authorization.replace("Bearer ", "") || "",
			};
			try {
				const decoded = jwt.verify(
					userToken.token,
					process.env.JWT_SECRET || ""
				) as User;
				res.status(200).json({
					error: false,
					message: "Login successful.",
					userData: decoded,
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
				message: "You need to login first.",
			});
		}
	} else {
		res.status(200).json({
			error: true,
			message: "Method not valid.",
		});
	}
}
