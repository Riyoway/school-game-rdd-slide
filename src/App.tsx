import NotesView from './presentation/NotesView'
import Presentation from './presentation/Presentation'

export default function App() {
  return window.location.pathname.replace(/\/+$/, '') === '/notes' ? <NotesView /> : <Presentation />
}
