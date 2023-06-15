const apiRequest = async (url,obj,errMsg) => {
    try{
        const response = await fetch(url,obj)
        if(!response.ok) throw Error('apiRequest didnt work')
    } catch (err) {
        errMsg = err.message
    } finally {
        return errMsg
    }
}

export default apiRequest