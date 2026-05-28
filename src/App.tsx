import "../reference code/variables.css"
import "./App.css"

import NavigationMenu from "../components/NavigationMenu/NavigationMenu"
import Form from "../components/Form/Form"

function App() {
  return (
    <div className="page">
      <NavigationMenu ctaLabel="Ouvrir un compte" ctaHref="#" showSearch />
      <div style={{ maxWidth: "60rem", margin: "0 auto", padding: "2rem 1rem" }}>
        <Form onSubmit={(values) => console.log("Form submitted:", values)} />
      </div>
    </div>
  )
}

export default App
