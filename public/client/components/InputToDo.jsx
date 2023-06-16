import React, {useState} from "react";
import { v4 as uuidv4 } from 'uuid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const InputTodo = ({addTodo,user}) => {

    const [todo,setTodo] =useState({title: "",completed:false,id:uuidv4(),userId:user})

    const handleSubmit = e => {
        e.preventDefault()
        if (!todo.title) return
        addTodo(todo)
        setTodo({...todo, title: "",id:uuidv4(),userId:user})
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2} direction="row" justifyContent="center"> 
                <TextField id="outlined-basic" label="name your new task" variant="outlined"
                type="text" value={todo.title} placeholder="name your new task" 
                onChange={e => setTodo(todo =>({...todo,title: e.target.value}))}/>
                <Button variant="contained" type="submit">add Todo item</Button>
            </Stack>
        </form>
    )
}
export default InputTodo