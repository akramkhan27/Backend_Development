import { useEffect, useState } from 'react'
import './App.css'
import axios from "axios"

function App() {
  let [jokes, setJokes] = useState([]);
  useEffect(()=>{
    // axios.get("http://localhost:3000/api/jokes")
    axios.get("/api/jokes")
    .then((response)=>{
      setJokes(response.data);
    })
    .catch((error)=>{
      console.log(error);
    })
  })
  return (
    <>
      <h1>Enjoy the Jokes</h1>
      <p>Jokes: {jokes.length}</p>
      {
        jokes.map((joke,index)=>(
          <div key={joke.id}>
          <h2>{joke.title}</h2>
          <p>{joke.content}</p>
          </div>
        ))
      }
    </>
  )
}

export default App
