import "../reference code/variables.css"
import "./App.css"

import NavigationMenu from "../components/NavigationMenu/NavigationMenu"

function App() {
  return (
    <div className="page">
      <NavigationMenu ctaLabel="Ouvrir un compte" ctaHref="#" showSearch />
    </div>
  )
}

export default App
