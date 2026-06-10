import * as Dialog from "@radix-ui/react-dialog"
import { useState } from "react"
import type { EspaceClientConfig } from "../NavigationMenu.types"
import { ArrowForwardIcon, CloseIcon, UserIcon } from "./icons"
import { EspaceIllustration } from "./EspaceIllustration"
import styles from "../styles"

export type EspaceClientModalProps = {
  /**
   * Desktop renders a centered modal; mobile renders a full-width drawer that
   * slides up from the bottom. The visual difference is driven entirely by the
   * `data-variant` attribute on the overlay/content (see NavigationMenu.module.css).
   */
  variant: "desktop" | "mobile"
  config: EspaceClientConfig
  /** Accessible label for the icon trigger button. */
  triggerLabel?: string
}

export function EspaceClientModal({
  variant,
  config,
  triggerLabel = "Espace client",
}: EspaceClientModalProps) {
  // Webflow renders each component inside a Shadow DOM with its own React root.
  // Radix Dialog's Portal defaults to document.body — outside the Shadow DOM —
  // so the CSS-module styles never reach the dialog. Portaling into an element
  // that lives inside our own subtree keeps the styles in scope. The anchor
  // uses display:contents so it adds no box of its own. (Same pattern as
  // NavigationMenuMobile.)
  const [container, setContainer] = useState<HTMLElement | null>(null)

  const triggerClassName =
    variant === "desktop" ? styles.iconButton : styles.mobileIconButton

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={triggerClassName}
          data-variant={variant === "desktop" ? "account" : undefined}
          aria-label={triggerLabel}
          data-modal-trigger="mon-espace"
        >
          <UserIcon />
        </button>
      </Dialog.Trigger>

      <span ref={setContainer} style={{ display: "contents" }} />

      <Dialog.Portal container={container ?? undefined}>
        <Dialog.Overlay className={styles.espaceOverlay} data-variant={variant} />
        <Dialog.Content className={styles.espaceContent} data-variant={variant}>
          <header className={styles.espaceHeader}>
            <Dialog.Title className={styles.espaceHeaderTitle}>
              {config.title}
            </Dialog.Title>
            <Dialog.Close
              className={styles.espaceClose}
              aria-label="Fermer"
            >
              <CloseIcon size={20} />
            </Dialog.Close>
          </header>

          <div className={styles.espaceBody}>
            <div className={styles.espaceIntro}>
              <EspaceIllustration className={styles.espaceIllustration} />
              <p className={styles.espaceHeading}>{config.heading}</p>
            </div>

            <div className={styles.espaceActions}>
              <a
                href={config.proHref}
                className={`${styles.espaceCta} ${styles.espaceCtaSecondary}`}
              >
                <span>{config.proLabel}</span>
                <ArrowForwardIcon size={24} />
              </a>
              <a
                href={config.comptesHref}
                className={`${styles.espaceCta} ${styles.espaceCtaPrimary}`}
              >
                <span>{config.comptesLabel}</span>
                <ArrowForwardIcon size={24} />
              </a>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default EspaceClientModal
