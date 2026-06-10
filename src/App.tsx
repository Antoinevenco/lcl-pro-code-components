import "../reference code/variables.css"
import "./App.css"

import NavigationMenu from "../components/NavigationMenu/NavigationMenu"
import Form from "../components/Form/Form"
import OfferFilter from "../components/OfferFilter/OfferFilter"

/**
 * Mock comparison table + cards used to validate OfferFilter's outside-DOM
 * contract in the local Vite preview. Mirrors what the Webflow page is
 * expected to provide — same class names and `data-filter-card` attributes.
 */
function OfferFilterHarness() {
  return (
    <section style={{ maxWidth: "60rem", margin: "0 auto", padding: "2rem 1rem", display: "grid", gap: "2rem" }}>
      <h2>Offer Filter preview</h2>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}>
        <div data-filter-card="lbylcl" style={{ padding: "1rem", border: "1px solid #ccc" }}>
          <p>Card — by LCL</p>
          <OfferFilter
            offers={[
              { title: "Carte Visa Business", value: "lbylcl" },
              { title: "Carte Visa personnalisée", value: "custom" },
            ]}
            defaultValue="lbylcl"
            ctaLabel="Prendre rendez-vous"
            ctaHref="#"
          />
        </div>
        <div data-filter-card="custom" style={{ padding: "1rem", border: "1px solid #ccc" }}>
          <p>Card — custom</p>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td className="offer-table-cell_wrap header" style={cellStyle}>Feature</td>
            <td className="offer-table-cell_wrap lbylcl-offer" style={cellStyle}>by LCL</td>
            <td className="offer-table-cell_wrap custom-offer" style={cellStyle}>Custom</td>
          </tr>
          <tr>
            <td className="offer-table-cell_wrap common" style={cellStyle}>Annual fee</td>
            <td className="offer-table-cell_wrap lbylcl-offer" style={cellStyle}>€0</td>
            <td className="offer-table-cell_wrap custom-offer" style={cellStyle}>€120</td>
          </tr>
          <tr>
            <td className="offer-table-cell_wrap common" style={cellStyle}>Cashback</td>
            <td className="offer-table-cell_wrap lbylcl-offer" style={cellStyle}>0.5%</td>
            <td className="offer-table-cell_wrap custom-offer" style={cellStyle}>1.5%</td>
          </tr>
        </tbody>
      </table>
      <p style={{ color: "#666" }}>Resize the window under 480px to see the table + cards collapse to the active offer.</p>
    </section>
  )
}

const cellStyle = { padding: "0.5rem 0.75rem", border: "1px solid #ddd" } as const

function App() {
  return (
    <div className="page">
      <NavigationMenu ctaLabel="Ouvrir un compte" ctaHref="#" showSearch />
      <OfferFilterHarness />
      <div style={{ maxWidth: "60rem", margin: "0 auto", padding: "2rem 1rem" }}>
        <Form onSubmit={(values) => console.log("Form submitted:", values)} />
      </div>
    </div>
  )
}

export default App
