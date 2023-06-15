import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const EditTodo = ({ editTodo, todoItem }) => {
  const [todo, setTodo] = useState({
    title: todoItem.title,
    completed: todoItem.completed,
    id: todoItem.id,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!todo.title) return;
    editTodo(todo);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} direction="row" justifyContent="center">
        <TextField
          id="outlined-basic"
          label="name your new task"
          variant="outlined"
          type="text"
          value={todo.title}
          placeholder={todo.title}
          onChange={(e) =>
            setTodo((todo) => ({ ...todo, title: e.target.value }))
          }
        />
        <Button variant="contained" type="submit">
          close editing
        </Button>
      </Stack>
    </form>
  );
};
export default EditTodo;
