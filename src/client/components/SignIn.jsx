import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Box, Button, Snackbar } from "@mui/material";
import { styled } from "@mui/system";

const StyledInput = styled("input")`
  margin: 10px;
  padding: 10px;
  font-size: 16px;
  width: 300px;
`;

const Popup = styled(Snackbar)`
  && {
    min-width: 1500px;
    text-align: center;
    margin-top: 50px;
  }
`;

const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    localStorage.clear()
}, [])

  const handleSubmit = async () => {
    try {
      console.log(`username = ${username}, password = ${password}`);
      const response = await axios.get(
        `http://127.0.0.1:3001/login?username=${username}&password=${password}`
      );
      if (response.data) {
        const info = response.data[0];
        localStorage.setItem("name", info["name"]);
        localStorage.setItem("api_key", info["api_key"]);
        localStorage.setItem("userInfo", JSON.stringify(response.data[0]));
        navigate(`/users/${response.data[0].id}/info`);
      } else {
        togglePopup();
      }
    } catch (err) {
      togglePopup();
      console.log(err?.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <div>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <StyledInput
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={"Username..."}
          onKeyDown={handleKeyDown}
        />
        <StyledInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={"Password..."}
          onKeyDown={handleKeyDown}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Login
        </Button>
        <Link to="/signup">
          <Button variant="text" color="primary">
            Don't have an account? Sign Up
          </Button>
        </Link>
      </Box>

      <Popup
        open={showPopup}
        autoHideDuration={2000}
        onClose={togglePopup}
        message="Incorrect username or password"
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />
    </div>
  );
};

export default SignIn;