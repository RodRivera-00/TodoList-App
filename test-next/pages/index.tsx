import { useRouter } from "next/router";
import { useEffect, useContext, useState } from "react";

//ChakraUI
import {
	Box,
	Button,
	Flex,
	Stack,
	Text,
	Input,
	useToast,
} from "@chakra-ui/react";

//Local
import { HomeResponse } from "../types/user";
import { Todo } from "../types/todo";
import { UserContext } from "./_app";
import NavBar from "../components/NavBar";
import Task from "../components/Task";
const theme = {
	container: {
		width: "1200px",
		minHeight: "100vh",
		maxWidth: "100%",
		background: "gray.200",
	},
	navBar: {
		border: "1px solid black",
		borderRadius: "5px",
		padding: "20px",
		width: "full",
	},
	taskTitle: {
		marginTop: "50px",
		fontSize: "30px",
		fontWeight: 700,
	},
};

const Home = () => {
	const { userData, setUserData } = useContext(UserContext);
	const [tasks, setTasks] = useState<Todo[]>([]);
	const [newTask, setNewTask] = useState<string>("");
	const [update, setUpdate] = useState<number>(0);
	const toast = useToast();
	const router = useRouter();
	const logout = () => {
		localStorage.clear();
		setUserData && setUserData(undefined);
	};
	const addTask = async () => {
		//Add guard for empty
		if (newTask === "") {
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
			await fetch("/data/todo", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: userData?.id,
					text: newTask,
				} as Todo),
			});
			//Give success toast
			toast({
				title: "Task added",
				description: `You have added ${newTask}`,
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			setNewTask("");
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
		async function fetchTodo() {
			try {
				const fetchResult = await fetch("/data/todo");
				const fetchJSON = await fetchResult.json();
				setTasks(fetchJSON as Todo[]);
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
		async function fetchData() {
			//Check if there is token available
			if (localStorage.token === undefined) {
				//Check if no token available
				localStorage.clear();
				router.push("/login");
			} else {
				if (userData === undefined) {
					const fetchResult = await fetch("/api/home", {
						method: "GET",
						headers: {
							Authorization: "Bearer " + localStorage.token,
						},
					});
					const fetchJSON: HomeResponse = await fetchResult.json();
					if (fetchJSON.error) {
						//Reset token, redirect to login
						toast({
							title: "Error",
							description: fetchJSON.message,
							status: "error",
							duration: 5000,
							isClosable: true,
							position: "top",
						});
						localStorage.clear();
						router.push("/login");
					} else {
						//Save to userData
						setUserData && setUserData(fetchJSON.userData);
					}
				} else {
					//Fetch Tasks if userData is available
					fetchTodo();
				}
			}
		}
		fetchData();
	}, [userData, update]);
	return (
		<Flex width="full" justifyContent="center">
			<Box sx={theme.container}>
				<NavBar username={userData?.username || ""} logout={logout} />
				<Stack justifyContent="center" alignItems="center">
					<Text sx={theme.taskTitle}>Todo List</Text>
					<Flex columnGap="10px" padding="20px">
						<Input
							value={newTask}
							onChange={(e) => setNewTask(e.target.value)}
							background="white"
							placeholder="New task name"
						/>
						<Button w="150px" onClick={addTask}>
							Add new task
						</Button>
					</Flex>
					{tasks.map((task) => (
						<Task
							taskId={task.id}
							userId={task.userId}
							text={task.text}
							update={update}
							setUpdate={setUpdate}
						/>
					))}
				</Stack>
			</Box>
		</Flex>
	);
};

export default Home;
