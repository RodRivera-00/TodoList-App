import { Box, Text, Button, Flex, Input, useToast } from "@chakra-ui/react";
import { useEffect, useState, useContext, SetStateAction } from "react";
import { UserContext } from "../../pages/_app";
const theme = {
	commentBox: {
		width: "full",
		padding: "5px",
		border: "1px solid rgba(0,0,0,0.7)",
	},
};

interface CommentBoxProps {
	commentId: number;
	taskId: number;
	userId: number;
	text: string;
	setUpdate: React.Dispatch<SetStateAction<number>>;
}
const CommentBox = ({
	text,
	userId,
	commentId,
	setUpdate,
}: CommentBoxProps) => {
	const { userData } = useContext(UserContext);
	const [editValue, setEditValue] = useState<string>();
	const toast = useToast();
	const updateComment = async () => {
		//Add guard for empty
		if (editValue === "") {
			toast({
				title: "Field must not be empty",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			return false;
		}
		try {
			await fetch("/data/comments/" + commentId, {
				method: "PATCH",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text: editValue,
				}),
			});
			//Give success toast
			toast({
				title: "Comment updated",
				description: `You have updated comment to ${editValue}`,
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			setEditValue(undefined);
			//Re-render and fetch new tasks from /todo
			setUpdate((value) => value + 1);
		} catch (e: any) {
			toast({
				title: "Error",
				description: e,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
		}
	};
	const deleteComment = async () => {
		try {
			await fetch("/data/comments/" + commentId, {
				method: "DELETE",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});
			//Give success toast
			toast({
				title: "Comment deleted",
				description: `You have deleted a comment`,
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			//Re-render and fetch new tasks from /todo
			setUpdate((value) => value + 1);
		} catch (e: any) {
			toast({
				title: "Error",
				description: e,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
		}
	};
	return (
		<Box mt="5px" sx={theme.commentBox}>
			<Flex justifyContent="space-between" flexWrap="wrap">
				{editValue !== undefined && (
					<Flex w="full" marginRight="5px" columnGap="5px">
						<Input
							background="white"
							value={editValue}
							onChange={(e) => setEditValue(e.target.value)}
						/>
						<Button colorScheme="green" onClick={updateComment}>
							Save
						</Button>
					</Flex>
				)}
				{editValue === undefined && (
					<>
						<Box maxWidth="75%">
							<Text>{text}</Text>
						</Box>
						{userData?.id === userId && (
							<Flex columnGap="5px">
								<Button colorScheme="teal" onClick={() => setEditValue(text)}>
									Edit
								</Button>
								<Button colorScheme="red" onClick={deleteComment}>
									Delete
								</Button>
							</Flex>
						)}
					</>
				)}
			</Flex>
		</Box>
	);
};
export default CommentBox;
