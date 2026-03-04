import { Route, Routes } from "react-router-dom"
import { Navbar } from "./components/navbar"
import Register from "./pages/Register"
import Companies from "./pages/Companies"
import Home from "./pages/Home"

function App() {

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="p-4">
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Register />} path="/register" />
          <Route element={<Companies />} path="/companies" />
        </Routes>
      </div>
    </main>
  )
}

export default App
