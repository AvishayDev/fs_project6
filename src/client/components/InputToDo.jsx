import React, {useState} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const InputTodo = ({addTodo}) => {

    const [todo,setTodo] =useState({title: "",completed:false})

    const handleSubmit = e => {
        e.preventDefault()
        if (!todo.title) return
        addTodo(todo)
        setTodo({...todo, title: ""})
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