import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Home(){
  const [problems, setProblems] = useState([])
  useEffect(()=>{
    axios.get('http://localhost:4000/api/problems').then(r=>setProblems(r.data)).catch(e=>console.error(e))
  },[])
  return (
    <div className="container">
      <header><h1>Codex Advanced</h1><nav><Link to="/login">Login</Link> | <Link to="/register">Register</Link></nav></header>
      <div className="list">
        {problems.map(p=>(
          <div className="card" key={p._id}>
            <h3>{p.title} <small>{p.difficulty}</small></h3>
            <p>{p.description.substring(0,120)}...</p>
            <Link to={'/problems/'+p._id}>Open</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
