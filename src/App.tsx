import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ListPage from './pages/ListPage'
import AddPage from './pages/AddPage'
import DetailPage from './pages/DetailPage'
import EditPage from './pages/EditPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/list" replace />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/add" element={<AddPage />} />
      </Route>
      <Route path="/detail/:id" element={<DetailPage />} />
      <Route path="/edit/:id" element={<EditPage />} />
    </Routes>
  )
}
