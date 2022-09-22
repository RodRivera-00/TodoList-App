import { useState } from "react";
import { useRouter } from "next/router";
//Chakra UI
import { Stack, Box, Text, Input, Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

const theme = {
	loginContainer: {
		width: { base: "100%", md: "50%", lg: "50%" },
		height: "100vh",
		direction: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	loginTitle: {
		fontSize: "30px",
		fontWeight: 700,
	},
	loginForm: {
		width: "300px",
		maxWidth: "100%",
		border: "1px solid rgba(0,0,0,0.5)",
		borderRadius: "10px",
		padding: "20px",
	},
	placeholder: {
		width: { base: "none", md: "block" },
		flexGrow: 1,
		background: "black",
		height: "100vh",
	},
	errorText: {
		fontSize: "10px",
		fontWeight: 600,
		color: "red",
	},
};

//Local
import { UserLogin, UserLoginErrors, LoginResponse } from "../../types/user";

const LoginPage = () => {
	const [loginData, setLoginData] = useState<UserLogin>({
		username: "",
		password: "",
	});
	const [error, setError] = useState<UserLoginErrors>();
	const [isLoading, setLoading] = useState<boolean>(false);
	const toast = useToast();
	const router = useRouter();
	const changeLogin = (type: keyof UserLogin, value: string) => {
		//Save data to state
		const newData = { ...loginData };
		newData[type] = value;
		setLoginData(newData);
	};
	const Login = async () => {
		//Check if loginData items are empty strings
		//This can be improved by using a library or creating a centralized validation
		let formValid = true;
		if (loginData.username === "") {
			formValid = false;
			setError((error) => {
				return {
					...error,
					username: "Username is required!",
				};
			});
		} else {
			setError((error) => {
				return { ...error, username: undefined };
			});
		}
		if (loginData.password === "") {
			formValid = false;
			setError((error) => {
				return { ...error, password: "Password is required!" };
			});
		} else {
			setError((error) => {
				return { ...error, password: undefined };
			});
		}
		//Check if form is valid to proceed
		if (formValid) {
			//Send login request
			setLoading(true);
			const rawSubmit = await fetch("/api/login/", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(loginData),
			});
			const response: LoginResponse = await rawSubmit.json();
			if (response.error) {
				//Send error toast
				toast({
					title: "Error logging in",
					description: response.message,
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "top",
				});
				setLoading(false);
				setError((error) => ({ ...error, formError: response.message }));
			} else {
				//Give success toast
				toast({
					title: "Login Success",
					description: response.message,
					status: "success",
					duration: 5000,
					isClosable: true,
					position: "top",
				});
				//Save as token
				localStorage.token = response.token;
				//Redirect to another page
				router.push("/");
			}
		}
	};
	return (
		<Stack direction="row">
			<Stack sx={theme.loginContainer}>
				<Text sx={theme.loginTitle}>TodoList Test Login</Text>
				<Stack sx={theme.loginForm}>
					{error?.formError && (
						<Text sx={theme.errorText}>{error.formError}</Text>
					)}
					<Text>Username</Text>
					<Input
						value={loginData.username}
						onChange={(e) => changeLogin("username", e.target.value)}
						type="text"
						isInvalid={
							error?.username !== undefined || error?.formError !== undefined
						}
					/>
					{error?.username && (
						<Text sx={theme.errorText}>{error.username}</Text>
					)}
					<Text>Password</Text>
					<Input
						value={loginData.password}
						onChange={(e) => changeLogin("password", e.target.value)}
						type="password"
						isInvalid={
							error?.password !== undefined || error?.formError !== undefined
						}
					/>
					{error?.password && (
						<Text sx={theme.errorText}>{error.password}</Text>
					)}
					<Button colorScheme="green" isLoading={isLoading} onClick={Login}>
						Login
					</Button>
				</Stack>
			</Stack>
			<Box sx={theme.placeholder} />
		</Stack>
	);
};
export default LoginPage;
