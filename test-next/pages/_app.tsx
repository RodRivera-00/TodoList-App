import type { AppProps } from "next/app";
import { useState, useEffect } from "react";

//ChakraUI
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

const fonts = {
	body: `'Roboto', san-serif`,
};
const breakpoints = {
	sm: "480px",
	md: "768px",
	lg: "1024px",
	xl: "1200px",
	"2xl": "2000px",
};

const theme = extendTheme({ fonts, breakpoints });

//Local
import { User, Token } from "../types/user";

function MyApp({ Component, pageProps }: AppProps) {
	const [userToken, setUserToken] = useState<Token>();
	useEffect(() => {
		//Check if userToken is undefined
		if (userToken === undefined) {
			//Check if there is a token on localStorage
			if (localStorage.token !== undefined) {
				//If available, set token to userToken
				setUserToken({ token: localStorage.token });
			}
		} else {
			//Set the state token to localStorage
			localStorage.setItem("token", userToken.token);
		}
	}, [userToken]);

	return (
		<ChakraProvider theme={theme}>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default MyApp;
