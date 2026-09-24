import { Search, X } from 'lucide-react'
import './SearchBar.css'
function SearchBar({ value, onChange }) { return <label className="search-bar"><Search/><input value={value} onChange={e=>onChange(e.target.value)} type="search" placeholder="Фильмы, сериалы, жанры..." />{value&&<button type="button" onClick={()=>onChange('')}><X/></button>}</label> }
export default SearchBar
