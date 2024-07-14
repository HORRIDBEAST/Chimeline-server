import initServer from './app'
const initialise=async()=>{
    const app=await initServer()
    const port=8412
    app.listen(port,()=>console.log(`Server has started on port ${port}`))
}
initialise();