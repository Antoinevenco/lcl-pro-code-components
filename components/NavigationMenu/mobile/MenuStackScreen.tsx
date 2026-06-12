import { useEffect, useRef } from "react"
import type {
  MenuEntry,
  MenuSection,
  MenuTab,
  SecondaryLink,
} from "../NavigationMenu.types"
import { Chevron } from "../primitives/Chevron"
import { isActiveHref, useActivePath } from "../hooks/useCurrentPath"
import styles from "../styles"

type CommonProps = {
  onBack?: () => void
  onPushEntry?: (entry: MenuEntry) => void
  onPushTab?: (tab: MenuTab) => void
  onPushSection?: (section: MenuSection) => void
}

export type RootScreenProps = CommonProps & {
  kind: "root"
  topBarLinks: { label: string; href: string; current?: boolean }[]
  menu: MenuEntry[]
  secondaryLinks: SecondaryLink[]
}

export type EntryScreenProps = CommonProps & {
  kind: "entry"
  entry: MenuEntry
}

export type TabScreenProps = CommonProps & {
  kind: "tab"
  entry: MenuEntry
  tab: MenuTab
}

export type MenuStackScreenProps =
  | RootScreenProps
  | EntryScreenProps
  | TabScreenProps

export function MenuStackScreen(props: MenuStackScreenProps) {
  if (props.kind === "root") return <RootScreen {...props} />
  if (props.kind === "entry") return <EntryScreen {...props} />
  return <TabScreen {...props} />
}

function RootScreen({
  topBarLinks,
  menu,
  secondaryLinks,
  onPushEntry,
}: RootScreenProps) {
  const tabsRef = useRef<HTMLDivElement>(null)
  const currentTabRef = useRef<HTMLAnchorElement>(null)
  const currentPath = useActivePath()

  // Anchor the horizontal scroll so the active top-nav item is in view by
  // default — the rail is left-aligned + horizontally scrollable, and the
  // "Professionnel" tab is the one users land on for this site.
  useEffect(() => {
    const scroller = tabsRef.current
    const active = currentTabRef.current
    if (!scroller || !active) return
    scroller.scrollLeft = active.offsetLeft - scroller.clientLeft
  }, [])

  return (
    <>
      <div className={styles.mobileTabs} ref={tabsRef}>
        {topBarLinks.map((l) => (
          <a
            key={l.label}
            href={l.href}
            ref={l.current ? currentTabRef : undefined}
            className={styles.mobileTab}
            data-current={l.current ? "true" : undefined}
            aria-current={l.current ? "page" : undefined}
          >
            {l.label}
          </a>
        ))}
      </div>

      <ul className={styles.mobileList}>
        {menu.map((entry) => {
          const hasChildren = !!(entry.sections?.length || entry.tabs?.length)
          return (
            <li key={entry.label}>
              {hasChildren ? (
                <button
                  type="button"
                  className={styles.mobileListItem}
                  onClick={() => onPushEntry?.(entry)}
                >
                  <span>{entry.label}</span>
                  <Chevron />
                </button>
              ) : (
                <a
                  className={styles.mobileListItem}
                  href={entry.href ?? "#"}
                  aria-current={
                    isActiveHref(entry.href, currentPath) ? "page" : undefined
                  }
                >
                  <span>{entry.label}</span>
                  <Chevron />
                </a>
              )}
            </li>
          )
        })}
      </ul>

      <hr className={styles.divider} />

      <ul className={styles.mobileList}>
        {secondaryLinks.map((l) => (
          <li key={l.label}>
            <a
              className={styles.mobileListItem}
              href={l.href}
              data-variant="quiet"
            >
              <span>{l.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

function EntryScreen({ entry, onBack, onPushTab }: EntryScreenProps) {
  if (entry.tabs?.length) {
    return (
      <>
        <SubHeader title={entry.label} onBack={onBack} />
        <ul className={styles.mobileList}>
          {entry.tabs.map((tab) => (
            <li key={tab.label}>
              <button
                type="button"
                className={styles.mobileListItem}
                onClick={() => onPushTab?.(tab)}
              >
                <span>{tab.label}</span>
                <Chevron />
              </button>
            </li>
          ))}
        </ul>
      </>
    )
  }

  const sections = entry.sections ?? []
  const primaries = sections.filter((s) => (s.variant ?? "primary") === "primary")
  const list = sections.find((s) => s.variant === "list")
  const hasEngagements = !!(entry.engagements || entry.engagementCards?.length)

  return (
    <>
      <SubHeader title={entry.label} onBack={onBack} />
      {primaries.map((section, i) => (
        <SectionList key={section.label + i} section={section} />
      ))}
      {hasEngagements ? <EngagementsBlock entry={entry} /> : null}
      {list ? <SimulerCard section={list} /> : null}
    </>
  )
}

function EngagementsBlock({ entry }: { entry: MenuEntry }) {
  return (
    <>
      {entry.engagementsLabel ? (
        <h3 className={styles.mobileListSection}>{entry.engagementsLabel}</h3>
      ) : null}
      {entry.engagements ?? (
        <ul className={styles.mobileList}>
          {(entry.engagementCards ?? []).map((card) => (
            <li key={card.title}>
              <a className={styles.mobileListItem} href={card.ctaHref}>
                <span>{card.title}</span>
                <Chevron />
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function TabScreen({ entry, tab, onBack }: TabScreenProps) {
  const sections = tab.sections
  const primary =
    sections.find((s) => (s.variant ?? "primary") === "primary") ?? sections[0]
  const list = sections.find((s) => s.variant === "list") ?? sections[1]

  return (
    <>
      <SubHeader title={`${entry.label} · ${tab.label}`} onBack={onBack} />
      {primary ? <SectionList section={primary} /> : null}
      {list ? <SimulerCard section={list} /> : null}
    </>
  )
}

function SubHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <button
      type="button"
      className={styles.mobileSubHeader}
      onClick={onBack}
      aria-label={`Retour à ${title}`}
    >
      <Chevron direction="left" className={styles.mobileBackChevron} />
      <span>{title}</span>
    </button>
  )
}

function SectionList({ section }: { section: MenuSection }) {
  const currentPath = useActivePath()
  return (
    <>
      <h3 className={styles.mobileListSection}>{section.label}</h3>
      <ul className={styles.mobileList}>
        {section.items.map((item) => (
          <li key={item.label}>
            <a
              className={styles.mobileListItem}
              href={item.href}
              aria-current={
                isActiveHref(item.href, currentPath) ? "page" : undefined
              }
            >
              <span>{item.label}</span>
              <Chevron />
            </a>
          </li>
        ))}
      </ul>
      {section.ctaLabel && section.ctaHref ? (
        <a
          className={styles.columnCta}
          href={section.ctaHref}
          style={{
            paddingInline: "var(--nav-inline-padding)",
            paddingBlock: "var(--_spacing---space--7)",
          }}
        >
          {section.ctaLabel}
        </a>
      ) : null}
    </>
  )
}

function SimulerCard({ section }: { section: MenuSection }) {
  return (
    <div className={styles.mobileSimulerCard}>
      <h3>{section.label}</h3>
      {section.items.map((item) => (
        <a key={item.label} href={item.href}>
          <span>{item.label}</span>
          <Chevron />
        </a>
      ))}
    </div>
  )
}

export default MenuStackScreen
