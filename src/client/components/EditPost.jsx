import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const EditPost = ({ editPostItem, postItem }) => {
  const [post, setTodo] = useState({
    title: postItem.title,
    body: postItem.body,
    id: postItem.id,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!post.title) return;
    editPostItem(post);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} direction="row" justifyContent="center">
        <TextField
          id="outlined-basic"
          label="update your post title"
          variant="outlined"
          type="text"
          value={post.title}
          placeholder={post.title}
          onChange={(e) =>
            setTodo((post) => ({ ...post, title: e.target.value }))
          }
          sx={{ flex: 1 }}
        />
        <TextField
          id="outlined-basic"
          label="update your post body"
          variant="outlined"
          type="text"
          value={post.body}
          placeholder={post.body}
          onChange={(e) =>
            setTodo((post) => ({ ...post, body: e.target.value }))
          }
          sx={{ flex: 2 }}
        />
        <Button variant="contained" type="submit">
          close editing
        </Button>
      </Stack>
    </form>
  );
};
export default EditPost;