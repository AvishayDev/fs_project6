import React, {useState} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const InputPost = ({addPost}) => {

    const [post,setPost] =useState({title: "",body:""})

    const handleSubmit = e => {
        e.preventDefault()
        if (!post.title) return
        addPost(post)
        setPost({title: "",body:""})
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2} direction="row" justifyContent="center"> 
                <TextField id="outlined-basic" label="write new post title" variant="outlined"
                type="text" value={post.title} placeholder="write new post title"
                onChange={e => setPost(post =>({...post,title: e.target.value}))}/>

                <TextField id="outlined-basic" label="write new post body" variant="outlined"
                type="text" value={post.body} placeholder="write new post body" 
                onChange={e => setPost(post =>({...post,body: e.target.value}))}/>

                <Button variant="contained" type="submit">add post item</Button>
            </Stack>
        </form>
    )
}
export default InputPost