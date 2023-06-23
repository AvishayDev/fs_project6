import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const EditComment = ({ editComment, commentItem }) => {
  const [comment, setComment] = useState({
    ...commentItem
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.body) return;
    editComment(comment);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} direction="row" justifyContent="center">
        <TextField
          id="outlined-basic"
          label="name your new task"
          variant="outlined"
          type="text"
          value={comment.body}
          placeholder={comment.body}
          onChange={(e) =>
            setComment((comment) => ({ ...comment, body: e.target.value }))
          }
          sx={{ flex: 1 }}
        />
        <Button variant="contained" type="submit">
          close editing
        </Button>
      </Stack>
    </form>
  );
};
export default EditComment;
