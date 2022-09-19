import type { AppProps } from "next/app";
import React, { useState, useEffect } from "react";

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

//Context
interface Context {
	userData?: User;
	setUserData?: React.Dispatch<React.SetStateAction<User | undefined>>;
}
export const UserContext = React.createContext<Context>({});

//Local
import { User, Token } from "../types/user";

function MyApp({ Component, pageProps }: AppProps) {
	const [userData, setUserData] = useState<User>();
	useEffect(() => {
		//Check if userToken is undefined
		if (userData !== undefined) {
			//Set the state token to localStorage
			localStorage.token = userData.token;
		}
	}, [userData]);

	return (
		<ChakraProvider theme={theme}>
			<UserContext.Provider value={{ userData, setUserData }}>
				<Component {...pageProps} />
			</UserContext.Provider>
		</ChakraProvider>
	);
}

export default MyApp;
