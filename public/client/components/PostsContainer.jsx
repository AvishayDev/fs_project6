import React, { useState, useEffect } from "react";
import CommentDisplay from "./CommentDisplay";
import { StyledLi } from "./StyledLi";

import axios from "axios";
import { useParams } from "react-router-dom";

import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";



const PostsContainer = () => {
  const { userId } = useParams();
  const [currentPost, setCurrentPost] = useState({});
  const [comments, setcomments] = useState(false);
  const [postData, setPostData] = useState({
    loading: true,
    postList: [],
    error: "",
  });
  const url = `https://jsonplaceholder.typicode.com/posts?userId=` + userId;

  useEffect(() => {
    const pull = async () => {
      try {
        const response = await axios.get(`${url}`);
        setPostData({
          ...postData,
          loading: false,
          postList: response.data,
          error: "",
        });
      } catch (err) {
        setPostData({
          ...postData,
          loading: false,
          postList: [],
          error: err.massage,
        });
      }
    };
    pull();
  }, []);

  const handleChooseClick = (Post) => {
    setCurrentPost({ ...Post });
    setcomments(false);
  };

  return postData.loading ? (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop="100px"
    >
      <Typography variant="h3" gutterBottom>
        Posts
      </Typography>
      <Typography variant="h5" gutterBottom>
        loading data...
      </Typography>
    </Box>
  ) : postData.error ? (
    <h1>{postData.error}</h1>
  ) : (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop="100px"
    >
      <Typography variant="h3" gutterBottom>
        Posts
      </Typography>
      <Box
        sx={{
          width: "80%",
          marginLeft: "10%",
          marginRight: "10%",
        }}
      >
        <ul>
          {postData.postList.map((Post) =>
            currentPost.id !== Post.id ? (
              <StyledLi key={Post.id}>
                <Typography variant="h4" gutterBottom>
                  {Post.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {Post.body}
                </Typography>
                <Button onClick={() => handleChooseClick(Post)}>Choose</Button>
              </StyledLi>
            ) : (
              <StyledLi key={Post.id}>
                <Typography variant="h3" gutterBottom>
                  {Post.title}
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {Post.body}
                </Typography>
                <Button onClick={() => handleChooseClick({})}>Unchoose</Button>
                <Button onClick={() => setcomments(!comments)}>Comments</Button>
                {comments ? <CommentDisplay Hi={Post.id} /> : <></>}
              </StyledLi>
            )
          )}
        </ul>
      </Box>
    </Box>
  );
};

export default PostsContainer;
