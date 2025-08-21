import { Routes, Route } from "react-router"
import CreatePage from './pages/createPage.jsx'
import DetailsPage from './pages/detailsPage.jsx'
import HomePage from './pages/homePage.jsx'


const App = () => {
  return (
    <div data-theme="forest">
      <button className="btn btn-error">clik me</button>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/details/:id" element={<DetailsPage />} />
      </Routes>
    </div>
  )
}

export default App