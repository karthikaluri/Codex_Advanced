
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Home(){
  const [problems, setProblems] = useState([])
  useEffect(()=>{
    axios.get('https://codex-advanced.onrender.com/api/problems').then(r=>setProblems(r.data)).catch(e=>console.error(e))
  },[])
  return (
    <div className="container">
      <header className="site-header">
        <div className="site-brand">codex</div>
        <nav className="site-nav"><Link to="/login">Login</Link><Link to="/register">Register</Link></nav>
      </header>

      <section className="hero">
        <h1>Codex — Advanced problem solving</h1>
        <p className="muted">Practice, submit, and improve. Beautiful UI, powerful backend.</p>
        <div className="hero-actions">
          <Link to="/register" className="btn">Get started</Link>
          <Link to="/problems/1" className="btn ghost">Browse problems</Link>
        </div>
      </section>

      <h2>Latest problems</h2>
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
