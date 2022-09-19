import { Stack, Text, Button } from "@chakra-ui/react";
const theme = {
	navBar: {
		border: "1px solid black",
		borderRadius: "5px",
		padding: "20px",
		width: "full",
	},
};
interface NavBarProps {
	username: string;
	logout(): void;
}
const NavBar = ({ username, logout }: NavBarProps) => {
	return (
		<Stack
			sx={theme.navBar}
			justifyContent="space-between"
			alignItems="center"
			direction="row"
		>
			<Text>Welcome {username}</Text>
			<Button colorScheme="red" onClick={logout}>
				Log out
			</Button>
		</Stack>
	);
};
export default NavBar;
