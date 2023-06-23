import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { StyledLi } from "./StyledLi";

const PostItem = ({ Post}) => {
    return (
        <StyledLi key={Post.id}>
            <Box display="flex"
      flexDirection="column">
                <Typography variant="h3" gutterBottom>
                    {Post.title}
                </Typography>
                <Typography variant="h5" gutterBottom>
                    {Post.body}
                </Typography>
            </Box>
        </StyledLi>
    );
};

export default PostItem;
