import app from '../src/index.js'
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`FragMates is running on http://localhost:${port}`)
})