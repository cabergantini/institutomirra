import { Route, Routes } from 'react-router-dom'
import { CharacterListPage } from './pages/CharacterListPage'
import { CharacterSheetPage } from './pages/CharacterSheetPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CharacterListPage />} />
      <Route path="/ficha/:id" element={<CharacterSheetPage />} />
    </Routes>
  )
}
