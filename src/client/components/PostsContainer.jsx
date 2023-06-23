import React, { useState, useEffect } from "react";
import CommentDisplay from "./CommentDisplay";
import InputPost from "./InputPost";
import { StyledLi } from "./StyledLi";
import axios from "axios";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import apiRequest from "../fetch/api";
import PostItem from './PostItem'
import EditPost from './EditPost'



const PostsContainer = () => {
  const { userId } = useParams();
  const [currentPost, setCurrentPost] = useState({});
  const [edit, setEdit] = useState(false);
  const apiKey = localStorage.getItem("api_key");
  const [comments, setcomments] = useState(false);
  const [postData, setPostData] = useState({
    loading: true,
    postList: [],
    error: "",
  });
  const url = `http://127.0.0.1:3001/users/${userId}/posts`;

  useEffect(() => {
    const pull = async () => {
      try {
        const response = await axios.get(`${url}?api_key=` + apiKey);
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

  const addPostItem = (postItem) => {
    const push = async () => {
      try {
        const response = await axios.post(`http://127.0.0.1:3001/posts?api_key=` + apiKey, { ...postItem, userId });
        if (response.status !== 200) {
          throw response.statusText;
        }
        const PostList = postData.postList.concat(response.data);
        setPostData({
          ...postData,
          postList: PostList,
        });
      } catch (err) {
        setPostData({
          ...postData,
          loading: false,
          error: err.massage,
        });
      }
    };
    push();
  };

  const editPostItem = (postItem) => {
    const update = {
      method: "PUT",
      body: JSON.stringify(postItem),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    const reqUrl = `http://127.0.0.1:3001/posts/${postItem.id}?api_key=` + apiKey;
    const result = apiRequest(reqUrl, update).then(handleEdit(postItem));
    if (result) console.log(result);
    setEdit(false);
  };

  const handleEdit = (post) => {
    const postList = postData.postList.map((member) =>
      member.id === post.id ? (member = post) : member
    );
    setPostData({
      ...postData,
      postList: postList,
    });
  };

  const handleEditClick = () => {
    setEdit(true);
  };

  const handleDeleteClick = (post) => {
    const update = { method: "DELETE" };
    const reqUrl = `http://127.0.0.1:3001/posts/${post.id}?api_key=` + apiKey;
    const result = apiRequest(reqUrl, update).then(handleDelete(post));
    if (result) console.log(result);
  };

  const handleDelete = (post) => {
    const postList = postData.postList.filter(
      (member) => member.id !== post.id
    );
    setPostData({ ...postData, postList: postList });
  };

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
      <Box>
        <InputPost addPost={addPostItem} />
      </Box>
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
                {edit ? (
                  <EditPost key={Post.id} editPostItem={editPostItem} postItem={Post} />
                ) : (<Box>
                  <PostItem Post={Post} />
                  <Button onClick={() => handleChooseClick({})}>Unchoose</Button>
                  <Button onClick={() => setcomments(!comments)}>Comments</Button>
                  <IconButton color="primary" onClick={() => handleEditClick(Post)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    variant="contained"
                    onClick={() => handleDeleteClick(Post)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                  {comments ? <CommentDisplay postId={Post.id} /> : <></>}
                </Box>
                )}
              </StyledLi>
            )
          )}
        </ul>
      </Box>
    </Box>
  );
};

export default PostsContainer;