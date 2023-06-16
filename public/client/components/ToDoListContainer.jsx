import React, { useState, useEffect } from "react";
import InputTodo from "./InputToDo";
import EditInput from "./EditToDo";
import apiRequest from "../fetch/api";
import TodoItem from "./TodoItem";

import axios from "axios";
import { useParams } from "react-router-dom";

import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import styled from "@mui/material/styles/styled";
import Typography from '@mui/material/Typography';
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const StyledBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginTop: "100px",
  flexDirection: "column",
});


const TodoListContainer = () => {
    const { userId } = useParams()
    const [currentTodo, setCurrentTodo] = useState({});
    const [azSort, setazSort] = useState("az");
    const [completeSort, setcompleteSort] = useState(true);
    const [TodoListData, setTodoListData] = useState({
        loading: true,
        TodoList: [],
        error: ''
    })
    const url = `https://jsonplaceholder.typicode.com/todos`

    useEffect(() => {
        const pull = async () => {
            try {
                const response = await axios.get(`${url}?userId=` + userId)
                setTodoListData({
                    ...TodoListData,
                    loading: false,
                    TodoList: response.data,
                    error: ''
                })
            } catch (err) {
                setTodoListData({
                    ...TodoListData,
                    loading: false,
                    TodoList: [],
                    error: err.massage
                })
            }
        }
        pull()
    }, [])

  const addTodoItem = (todoItem) => {
    const push = async () => {
      try {
        const response = await axios.post(`${url}`, todoItem);
        if (response.status !== 201) {
          throw response.statusText;
        }
        const TodoList = TodoListData.TodoList.concat(todoItem);
        setTodoListData({
          ...TodoListData,
          TodoList: TodoList,
        });
      } catch (err) {
        setTodoListData({
          ...TodoListData,
          loading: false,
          error: err.massage,
        });
      }
    };
    push();
  };

  const editToDoItem = (todoItem) => {
    const update = {
      method: "PUT",
      body: JSON.stringify(todoItem),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    const reqUrl = `${url}/${todoItem.id}`;
    const result = apiRequest(reqUrl, update).then(handleEdit(todoItem));
    if (result) console.log(result);
    setCurrentTodo({});
  };

  const handleEdit = (todo) => {
    const TodoList = TodoListData.TodoList.map((member) =>
      member.id === todo.id ? (member = todo) : member
    );
    setTodoListData({
      ...TodoListData,
      TodoList: TodoList,
    });
  };

  const handleEditClick = (todo) => {
    setCurrentTodo({ ...todo });
  };

  const handleDeleteClick = (todo) => {
    const update = { method: "DELETE" };
    const reqUrl = `${url}/${todo.id}`;
    const result = apiRequest(reqUrl, update).then(handleDelete(todo));
    if (result) console.log(result);
  };

  const handleDelete = (todo) => {
    const TodoList = TodoListData.TodoList.filter(
      (member) => member.id !== todo.id
    );
    setTodoListData({ ...TodoListData, TodoList: TodoList });
  };

  const handleSortAZClick = () => {
    const sort = TodoListData.TodoList.sort((a, b) =>
      a.title < b.title ? -1 : 1
    );
    setTodoListData({
      ...TodoListData,
      TodoList: sort,
    });
    setazSort("za");
  };

  const handleSortZAClick = () => {
    const sort = TodoListData.TodoList.sort((a, b) =>
      a.title > b.title ? -1 : 1
    );
    setTodoListData({
      ...TodoListData,
      TodoList: sort,
    });
    setazSort("az");
  };

  const handleSortCompleteClick = () => {
    const sort = TodoListData.TodoList.sort((a, b) =>
      a.completed > b.completed ? -1 : 1
    );
    setTodoListData({
      ...TodoListData,
      TodoList: sort,
    });
    setcompleteSort(false);
  };

  const handleSortIncompleteClick = () => {
    const sort = TodoListData.TodoList.sort((a, b) =>
      a.completed < b.completed ? -1 : 1
    );
    setTodoListData({
      ...TodoListData,
      TodoList: sort,
    });
    setcompleteSort(true);
  };

  return TodoListData.loading ? (
    <Box display="flex" justifyContent="center" marginTop="100px">
      <Typography variant="h3" gutterBottom>TodoList</Typography>
      <Typography variant="h5" gutterBottom>loading data...</Typography>
    </Box>
  ) : TodoListData.error ? (
    <h1>{TodoListData.error}</h1>
  ) : (
    <StyledBox>
      <Box display="flex" justifyContent="center">
        <Typography variant="h3" gutterBottom>TodoList</Typography>
      </Box>
      <Box>
        <InputTodo addTodo={addTodoItem} user={TodoListData.userID} />
      </Box>
      <Box display="flex" justifyContent="center" marginTop="20px">
        {azSort !== "az" ? (
          <Button variant="outlined" onClick={() => handleSortZAClick()}>
            A - Z
            <ArrowUpwardIcon />
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => handleSortAZClick()}>
            A - Z
            <ArrowDownwardIcon />
          </Button>
        )}
        {!completeSort  ? (
          <Button variant="outlined" onClick={() => handleSortIncompleteClick()}>
            COMPLETE
            <ArrowUpwardIcon />
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => handleSortCompleteClick()}>
            COMPLETE
            <ArrowDownwardIcon />
          </Button>
        )}
      </Box>
      <Box display="flex" justifyContent="center">
        <ul>
          {TodoListData.TodoList.map((todo) =>
            currentTodo.id !== todo.id ? (
              <TodoItem
                key={todo.id}
                todo={todo}
                currentTodo={currentTodo}
                editToDoItem={editToDoItem}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
              />
            ) : (
              <EditInput key={todo.id} editTodo={editToDoItem} todoItem={todo} />
            )
          )}
        </ul>
      </Box>
    </StyledBox>
  );  
};
export default TodoListContainer;
