import { useState } from 'react'

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
          <div className="max-w-5xl mx-auto">
            <Navbar />
            <Hero />
          </div>
    </>
  )
}

export default App
