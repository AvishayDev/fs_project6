import TodoListContainer from "./components/ToDoListContainer";
import PostsContainer from "./components/PostsContainer";
import Info from "./components/Info";
import {
  createBrowserRouter,
  createRoutesFromElements, 
  Navigate,
  Route,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import SignIn from "./components/SignIn";

import Button from "@mui/material/Button";
import { AppBar, Toolbar } from "@mui/material";
import styled from "@mui/material/styles/styled";
import React, { useState } from "react";

const StyledButton = styled(Button)`
  && {
    color: white;
    margin-right: 0;
    text-decoration: none;
  }

  &:hover {
    color: blue;
  }

  &:active {
    color: red;
  }
`;

const Root = () => {
  const [name, setName] = useState(localStorage.getItem("name"));
  return (
    (name)?(
    <>
      <AppBar position="fixed" sx={{ width: "100%", background: "#299e0a" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <StyledButton component={Link} to="info">
              Info
            </StyledButton>
            <StyledButton component={Link} to="todos">
              Todos
            </StyledButton>
            <StyledButton component={Link} to="posts">
              Posts
            </StyledButton>
          </div>
          <div>
            <h2>{name}</h2> 
          </div>
          <div style={{ display: "flex" }}>
            <StyledButton
              component={Link}
              to="/login"
              onClick={() => {localStorage.clear()}}
            >
              Sign Out
            </StyledButton>
          </div>
        </Toolbar>
      </AppBar>

      <div style={{ marginTop: "64px" }}>
        <Outlet />
      </div>
    </>
    ):(<Navigate to={"/login"}/>)
  );
};

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Navigate to="/login" />} />
        <Route path="login" element={<SignIn />} />
        <Route path="users/:userId" element={<Root />}>
          <Route path="info" element={<Info />} />
          <Route path="todos" element={<TodoListContainer />} />
          <Route path="Posts" element={<PostsContainer />} />
        </Route>
      </Route>
    )
  );

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
