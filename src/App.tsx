import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import RadixianProvider from './context/radix'
import Farm from './pages/farm'

function App() {

  return (
    <RadixianProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Farm />} />
        </Routes>
      </BrowserRouter>
    </RadixianProvider>
  )
}

export default App
