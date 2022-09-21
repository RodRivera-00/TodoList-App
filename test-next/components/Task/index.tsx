import {
	Box,
	Button,
	Flex,
	Input,
	Text,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useContext, useRef, SetStateAction } from "react";
import { UserContext } from "../../pages/_app";
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
	update: number;
	setUpdate: React.Dispatch<SetStateAction<number>>;
}

const Task = ({ taskId, text, update, setUpdate }: TaskProps) => {
	const { userData } = useContext(UserContext);
	const [comments, setComments] = useState<Comment[]>([]);
	const toast = useToast();
	const [comment, setComment] = useState<string>("");
	const [editValue, setEditValue] = useState<string>();
	const [alertOpen, setAlertOpen] = useState<boolean>(false);
	const cancelRef = useRef(null);
	const addComment = async () => {
		//Add guard for empty
		if (comment === "") {
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
			await fetch("/data/comments/", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: userData?.id,
					todoId: taskId,
					text: comment,
				} as Comment),
			});
			//Give success toast
			toast({
				title: "Task added",
				description: `You have commented ${comment}`,
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			setComment("");
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
	const updateTask = async () => {
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
			await fetch("/data/todo/" + taskId, {
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
				title: "Task updated",
				description: `You have updated task to ${editValue}`,
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
	const deleteTask = async () => {
		try {
			//Delete Task
			await fetch("/data/todo/" + taskId, {
				method: "DELETE",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});
			//Give success toast
			toast({
				title: "Task deleted",
				description: `You have deleted a task`,
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
	useEffect(() => {
		async function fetchComments() {
			try {
				//Fetch comments with specific todoId
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
	}, [update]);
	return (
		<Box sx={theme.task}>
			<Flex justifyContent="space-between">
				{editValue !== undefined && (
					<Flex w="full" marginRight="5px" columnGap="5px">
						<Input
							background="white"
							value={editValue}
							onChange={(e) => setEditValue(e.target.value)}
						/>
						<Button colorScheme="green" onClick={updateTask}>
							Save
						</Button>
					</Flex>
				)}
				{editValue === undefined && (
					<>
						<Text sx={theme.taskTitle}>{text}</Text>
						<Flex columnGap="5px">
							<Button colorScheme="teal" onClick={() => setEditValue(text)}>
								Edit
							</Button>
							<Button colorScheme="red" onClick={() => setAlertOpen(true)}>
								Delete
							</Button>
							<AlertDialog
								isOpen={alertOpen}
								leastDestructiveRef={cancelRef}
								onClose={() => setAlertOpen(false)}
							>
								<AlertDialogOverlay>
									<AlertDialogContent>
										<AlertDialogHeader fontSize="lg" fontWeight="bold">
											Delete Comment
										</AlertDialogHeader>

										<AlertDialogBody>
											Are you sure to delete the comment?
										</AlertDialogBody>

										<AlertDialogFooter>
											<Button
												ref={cancelRef}
												onClick={() => setAlertOpen(false)}
											>
												Cancel
											</Button>
											<Button colorScheme="red" onClick={deleteTask} ml={3}>
												Delete
											</Button>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialogOverlay>
							</AlertDialog>
						</Flex>
					</>
				)}
			</Flex>

			<Text sx={theme.commentTitle}>Comments</Text>
			{comments.map((comment) => {
				return (
					comment.todoId === taskId && (
						<CommentBox
							commentId={comment.id}
							taskId={comment.todoId}
							userId={comment.userId}
							text={comment.text}
							setUpdate={setUpdate}
						/>
					)
				);
			})}
			{comments.length === 0 && <Text>No comments yet.</Text>}
			<Flex mt="5px" columnGap="20px">
				<Input
					background="white"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					placeholder="Add comment"
				/>
				<Button colorScheme="blue" onClick={addComment}>
					Add comment
				</Button>
			</Flex>
		</Box>
	);
};
export default Task;
