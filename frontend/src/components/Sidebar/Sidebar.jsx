import './Sidebar.css'
import { Bookmark, Clapperboard, House, Sparkles, Tv } from 'lucide-react'

const links = [
  { icon:House, label:'Главная', route:'home' },
  { icon:Clapperboard, label:'Фильмы', route:'movies' },
  { icon:Tv, label:'Сериалы', route:'series' },
  { icon:Sparkles, label:'Новинки', route:'new' },
  { icon:Bookmark, label:'Мой список', route:'my-list' },
]

function Sidebar({ route, onNavigate }) {
  return <aside className="sidebar">
    <button className="sidebar__logo" onClick={() => onNavigate('home')}>VAMS <span>films</span></button>
    <nav className="sidebar__nav" aria-label="Навигация">
      {links.map(({ icon:Icon, label, route:itemRoute }) => <button className={`sidebar__link ${route === itemRoute ? 'sidebar__link--active' : ''}`} onClick={() => onNavigate(itemRoute)} key={itemRoute}><Icon aria-hidden="true" />{label}</button>)}
    </nav>
    <div className="sidebar__footer"><span className="sidebar__status" />Кино начинается здесь</div>
  </aside>
}
export default Sidebar
