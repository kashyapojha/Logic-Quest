import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App'
import {XpProvider} from './xp'
import './styles.css'
createRoot(document.getElementById('root')!).render(<BrowserRouter><XpProvider><App/></XpProvider></BrowserRouter>)
