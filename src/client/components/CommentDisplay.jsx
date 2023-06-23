import React, { useState, useEffect } from "react";
import axios from "axios";
import InputComment from "./InputComment";
import { Box } from "@mui/material";
import Typography from '@mui/material/Typography';
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import apiRequest from "../fetch/api";
import EditComment from './EditComment'

const StyledLi = styled("li")(({ theme }) => ({
  listStyleType: "none",
  marginBottom: "10px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CommentDisplay = ({ postId }) => {
  const [commentsData, setCommentsData] = useState({
    loading: true,
    commentList: [],
    error: "",
  });
  const [currentComment, setCurrentComment] = useState({});
  const apiKey = localStorage.getItem("api_key");
  const { userId } = useParams();
  const url = `http://127.0.0.1:3001/posts/${postId}/comments`;

  useEffect(() => {
    const pull = async () => {
      try {
        const response = await axios.get(`${url}?api_key=` + apiKey);
        setCommentsData({
          ...commentsData,
          loading: false,
          commentList: commentsData.commentList.concat(response.data),
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

  const addCommentItem = (commentItem) => {
    const push = async () => {
      try {
        const response = await axios.post(`http://127.0.0.1:3001/comments?api_key=` + apiKey, { ...commentItem, postId, });
        if (response.status !== 200) {
          throw response.statusText;
        }
        const CommentList = commentsData.commentList.concat(response.data);
        setCommentsData({
          ...commentsData,
          commentList: CommentList,
        });
      } catch (err) {
        setCommentsData({
          ...commentsData,
          loading: false,
          error: err.massage,
        });
      }
    };
    push();
  };

  const editCommentItem = (commentItem) => {
    const update = {
      method: "PUT",
      body: JSON.stringify(commentItem),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    const reqUrl = `http://127.0.0.1:3001/comments/${commentItem.id}?api_key=` + apiKey;
    const result = apiRequest(reqUrl, update).then(handleEdit(commentItem));
    if (result) console.log(result);
    setCurrentComment({});
  };

  const handleEdit = (comment) => {
    const commentList = commentsData.commentList.map((member) =>
      member.id === comment.id ? (member = comment) : member
    );
    setCommentsData({
      ...commentsData,
      commentList: commentList,
    });
  };

  const handleEditClick = (comment) => {
    setCurrentComment(comment);
  };

  const handleDeleteClick = (comment) => {
    const update = { method: "DELETE" };
    const reqUrl = `http://127.0.0.1:3001/comments/${comment.id}?api_key=` + apiKey;
    const result = apiRequest(reqUrl, update).then(handleDelete(comment));
    if (result) console.log(result);
  };

  const handleDelete = (comment) => {
    const commentList = commentsData.commentList.filter(
      (member) => member.id !== comment.id
    );
    setCommentsData({ ...commentsData, commentList: commentList });
  };

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
      <Box>
        <InputComment addComment={addCommentItem} />
      </Box>
      <ul>
        {commentsData.commentList.map((comment) => (
          currentComment.id !== comment.id ? (
          <StyledLi key={comment.id}>
            <Typography variant="body1" gutterBottom>{comment.body}</Typography>
            <IconButton color="primary" onClick={() => handleEditClick(comment)}>
              <EditIcon />
            </IconButton>
            <IconButton
              variant="contained"
              onClick={() => handleDeleteClick(comment)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </StyledLi>
        ) : (
          <EditComment key={comment.id} editComment={editCommentItem} commentItem={comment} />
        ))
        )}
      </ul>
    </div>
  );
};
export default CommentDisplay;
