import NotesView from './presentation/NotesView'
import Presentation from './presentation/Presentation'
import RequirementsView from './requirements/RequirementsView'

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '')
  if (path === '/notes') return <NotesView />
  if (path === '/requirements') return <RequirementsView />
  return <Presentation />
}
