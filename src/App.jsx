import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Health from './pages/Health'
import Finance from './pages/Finance'
import Notes from './pages/Notes'
import Investments from './pages/Investments'
import Passwords from './pages/Passwords'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/health" element={<Health />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/passwords" element={<Passwords />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

