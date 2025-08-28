import { useState } from 'react'

import './App.css'
import LoginSignup from './Components/LoginSignup/LoginSignup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <LoginSignup/>
      </div>
      
    </>
  )
}

export default App
