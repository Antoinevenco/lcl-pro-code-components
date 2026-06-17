import { beforeEach, describe, expect, it } from "vitest"
import { ensureSearchWidget, openSearch, SEARCH_EVENT } from "./bridge"

/**
 * Sets window.location.hostname under jsdom. jsdom's location is not writable,
 * so we redefine the property for the duration of the test.
 */
function setHostname(hostname: string) {
  Object.defineProperty(window, "location", {
    value: { ...window.location, hostname },
    writable: true,
    configurable: true,
  })
}

interface SearchWindow {
  __lclSearchWidgetLoaded?: boolean
  __lclSearchWidgetLoading?: boolean
  LCL_SEARCH_SCOPE?: string
  LCL_SEARCH_WIDGET_SRC?: string
}

beforeEach(() => {
  const w = window as unknown as SearchWindow
  // Reset both idempotency guards + scope between cases. In jsdom the injected
  // script never fires onload, so __lclSearchWidgetLoading would otherwise stay
  // true and block every case after the first.
  delete w.__lclSearchWidgetLoaded
  delete w.__lclSearchWidgetLoading
  delete w.LCL_SEARCH_SCOPE
  delete w.LCL_SEARCH_WIDGET_SRC
  document.head.innerHTML = ""
})

describe("ensureSearchWidget — env table", () => {
  // host → expected widget <script> src base, per the bridge env table.
  const cases: Array<{ host: string; scope: "portail" | "lclpro"; src: string }> = [
    {
      host: "lclpro.webflow.io",
      scope: "lclpro",
      src: "https://portail-entrepreneur.webflow.io/search-api/search-widget.js",
    },
    {
      host: "professionnel.lcl.fr",
      scope: "lclpro",
      src: "https://www.entrepreneur.lcl.fr/search-api/search-widget.js",
    },
    {
      host: "portail-entrepreneur.webflow.io",
      scope: "portail",
      // Portail is same-origin → relative path.
      src: "/search-api/search-widget.js",
    },
    {
      host: "entrepreneur.lcl.fr",
      scope: "portail",
      src: "/search-api/search-widget.js",
    },
  ]

  for (const { host, scope, src } of cases) {
    it(`injects the widget script for ${host}`, () => {
      setHostname(host)

      ensureSearchWidget(scope)

      const scripts = document.head.querySelectorAll("script")
      expect(scripts).toHaveLength(1)
      const script = scripts[0] as HTMLScriptElement
      // .src on a DOM node resolves relative URLs; compare the raw attribute.
      expect(script.getAttribute("src")).toBe(src)
      expect(script.async).toBe(true)
      expect((window as unknown as SearchWindow).LCL_SEARCH_SCOPE).toBe(scope)
    })
  }

  it("is idempotent — only injects the script once across triggers", () => {
    setHostname("entrepreneur.lcl.fr")

    ensureSearchWidget("portail")
    ensureSearchWidget("portail")

    expect(document.head.querySelectorAll("script")).toHaveLength(1)
  })

  it("honours an explicit LCL_SEARCH_WIDGET_SRC override", () => {
    setHostname("lclpro.webflow.io")
    ;(window as unknown as SearchWindow).LCL_SEARCH_WIDGET_SRC =
      "https://example.test/custom-widget.js"

    ensureSearchWidget("lclpro")

    const script = document.head.querySelector("script") as HTMLScriptElement
    expect(script.getAttribute("src")).toBe("https://example.test/custom-widget.js")
  })
})

describe("openSearch — event contract", () => {
  it("dispatches lcl:open-search with the right detail", () => {
    let detail: { query: string; source: string; scope: string } | undefined
    const handler = (e: Event) => {
      detail = (e as CustomEvent).detail
    }
    window.addEventListener(SEARCH_EVENT, handler)

    openSearch("mortgage", "hero-bar", "lclpro")

    window.removeEventListener(SEARCH_EVENT, handler)
    expect(detail).toEqual({
      query: "mortgage",
      source: "hero-bar",
      scope: "lclpro",
    })
  })

  it("emits a CustomEvent of the documented type", () => {
    let received: Event | undefined
    const handler = (e: Event) => {
      received = e
    }
    window.addEventListener(SEARCH_EVENT, handler)

    openSearch("", "nav", "portail")

    window.removeEventListener(SEARCH_EVENT, handler)
    expect(received).toBeInstanceOf(CustomEvent)
    expect(received?.type).toBe(SEARCH_EVENT)
  })
})
