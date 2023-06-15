import React, { useState, useEffect } from "react";
import axios from "axios";

import Typography from '@mui/material/Typography';
import { styled } from "@mui/material/styles";

const StyledLi = styled("li")(({ theme }) => ({
  listStyleType: "none",
  marginBottom:"10px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CommentDisplay = (hi) => {
  const [commentsData, setCommentsData] = useState({
    loading: true,
    commentList: [],
    error: "",
  });

  useEffect(() => {
    const url = `https://jsonplaceholder.typicode.com/comments?postId=` + hi.Hi;
    const pull = async () => {
      try {
        const response = await axios.get(`${url}`);
        setCommentsData({
          ...commentsData,
          loading: false,
          commentList: response.data,
          error: "",
        });
      } catch (err) {
        setCommentsData({
          ...commentsData,
          loading: false,
          commentList: [],
          error: err.massage,
        });
      }
    };
    pull();
  }, []);

  return commentsData.loading ? (
    <div>
      <Typography variant="h5" gutterBottom>Comments</Typography>
      <Typography variant="body1" gutterBottom>loading comments...</Typography>
    </div>
  ) : commentsData.error ? (
    <h1>{commentsData.error}</h1>
  ) : (
    <div>
      <Typography variant="h5" gutterBottom>Comments</Typography>
      <ul>
        {commentsData.commentList.map((comment) => (
          <StyledLi key={comment.id}>
            <Typography variant="body1" gutterBottom>{comment.body}</Typography>
          </StyledLi>
        ))}
      </ul>
    </div>
  );
};
export default CommentDisplay;
