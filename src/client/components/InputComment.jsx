import React, {useState} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const InputComment = ({addComment}) => {

    const [comment,setComment] =useState({body:"",name:"",email:""})

    const handleSubmit = e => {
        e.preventDefault()
        if (!comment.body) return
        addComment(comment)
        setComment({body:"",name:"",email:""})
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2} direction="row" justifyContent="center"> 
                <TextField id="outlined-basic" label="write new comment" variant="outlined"
                type="text" value={comment.body} placeholder="write new comment" 
                onChange={e => setComment(comment =>({...comment,body: e.target.value}))}/>

                <Button variant="contained" type="submit">add comment item</Button>
            </Stack>
        </form>
    )
}
export default InputComment