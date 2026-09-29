import { useState } from 'react'
import './App.css'
import Nav from './components/Nav'
import Home from './Home'
import Noticias from './Noticias'

function App() {
  return (
    <>
      <Nav />
      <Noticias />
    </>
  )
}

export default App