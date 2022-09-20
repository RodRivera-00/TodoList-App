import { Box, Button, Flex, Input, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
const theme = {
	task: {
		padding: "20px",
		border: "1px solid black",
		borderRadius: "20px",
		width: "700px",
	},
	taskTitle: {
		fontSize: "24px",
		fontWeight: 500,
	},
	commentBox: {
		width: "full",
		padding: "5px",
		border: "1px solid rgba(0,0,0,0.7)",
	},
	commentTitle: {
		fontSize: "12px",
		fontWeight: "600",
	},
};

import { Comment } from "../../types/comment";
import CommentBox from "../Comment";

interface TaskProps {
	taskId: number;
	userId: number;
	text: string;
}

const Task = ({ taskId, text }: TaskProps) => {
	const [comments, setComments] = useState<Comment[]>([]);
	const toast = useToast();
	useEffect(() => {
		async function fetchComments() {
			try {
				const fetchResult = await fetch(
					"/data/comments?" +
						new URLSearchParams({
							todoId: taskId.toString(),
						})
				);
				const fetchJSON = await fetchResult.json();
				setComments(fetchJSON as Comment[]);
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
		}
		fetchComments();
	}, []);
	return (
		<Box sx={theme.task}>
			<Text sx={theme.taskTitle}>{text}</Text>
			<Text sx={theme.commentTitle}>Comments</Text>
			{comments.map((comment) => (
				<CommentBox
					commentId={comment.id}
					taskId={comment.todoId}
					userId={comment.userId}
					text={comment.text}
				/>
			))}
			<Flex mt="20px" columnGap="20px">
				<Input background="white" />
				<Button colorScheme="blue">Add comment</Button>
			</Flex>
		</Box>
	);
};
export default Task;
