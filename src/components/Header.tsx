import { Link } from '@tanstack/react-router'
import NavigationBar from './global/NavigationBar'

export default function Header() {
  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <NavigationBar />
    </header>
  )
}
