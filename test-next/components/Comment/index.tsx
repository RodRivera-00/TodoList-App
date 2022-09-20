import { Box, Text } from "@chakra-ui/react";

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
}
const CommentBox = ({ text }: CommentBoxProps) => {
	return <Box sx={theme.commentBox}>{text}</Box>;
};
export default CommentBox;
