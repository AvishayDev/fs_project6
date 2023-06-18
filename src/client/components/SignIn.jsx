import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const [userName, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users?username=${userName}`
      );
      if (response.data[0]?.address?.geo?.lat) {
        if (
          password === String(response.data[0]?.address?.geo?.lat).slice(-4)
        ) {
          localStorage.setItem("userName", userName);
          localStorage.setItem("password", password);
          localStorage.setItem("fullName", response.data[0].name);
          navigate(`/users/${response.data[0].id}/info`);
        } else {
          togglePopup();
        }
      } else {
        togglePopup();
      }
    } catch (err) {
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
          value={userName}
          onChange={(e) => setUser(e.target.value)}
          placeholder={"username..."}
          onKeyDown={handleKeyDown}
        />
        <StyledInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={"password..."}
          onKeyDown={handleKeyDown}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Login
        </Button>
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
