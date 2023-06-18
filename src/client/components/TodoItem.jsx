import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import { StyledLi } from "./StyledLi";


const StyledTypography = styled(Typography)(({ completed }) => ({
  textDecoration: completed ? "line-through" : "none",
}));

const TodoItem = ({
  todo,
  editToDoItem,
  handleEditClick,
  handleDeleteClick,
}) => {
  const handleCheckboxClick = () => {
    editToDoItem({ ...todo, completed: !todo.completed });
  };

  return (
    <StyledLi key={todo.id}>
      <Box display="flex" alignItems="center">
        <StyledTypography
          component="span"
          variant="h6"
          gutterBottom
          completed={todo.completed}
        >
          {todo.title}
          <Checkbox
            onClick={handleCheckboxClick}
            color="success"
            checked={todo.completed}
          />
        </StyledTypography>
        <IconButton color="primary" onClick={() => handleEditClick(todo)}>
          <EditIcon />
        </IconButton>
        <IconButton
          variant="contained"
          onClick={() => handleDeleteClick(todo)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </StyledLi>
  );
};

export default TodoItem;
