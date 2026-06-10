/**
 * "Prévoyance" functional illustration — the animated user mark shown at the top
 * of the Espace client modal. Sourced from Figma
 * (Illustrations fonctionnelles / Icones animés / Prevoyance).
 *
 * Colour notes — only the core blue maps cleanly onto a live site token:
 *   #3B51D5 -> --_swatch---swatch--brand-blue-600
 * The decorative tints have no equivalent in /reference code/variables.css yet,
 * so they stay as the Figma brand hexes below until those tokens are registered:
 *   - #E0E6FF (soft ring)    TODO: add Webflow var --_swatch---swatch--brand-blue-150
 *   - #ADBEFF (light shards) TODO: add Webflow var --_swatch---swatch--brand-blue-250 (site brand-blue-200 is #85a9ff, a different shade)
 *   - #FFA702 (accent dot)   TODO: add Webflow var --_swatch---swatch--functional-orange-400
 */

type EspaceIllustrationProps = {
  className?: string
}

export function EspaceIllustration({ className }: EspaceIllustrationProps) {
  return (
    <svg
      viewBox="0 0 95.8334 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ display: "block" }}
    >
      <path
        d="M73.1864 83.3333L77.4992 90.8703L61.812 100L57.4992 92.463L73.1864 83.3333Z"
        fill="#ADBEFF"
      />
      <path
        d="M12.5 79.1667V91.6667H7.94729e-08V79.1667H12.5Z"
        fill="#FFA702"
      />
      <path
        d="M95.8334 29.577L91.2546 37.5005L83.3333 32.924L87.9121 25.0005L95.8334 29.577Z"
        fill="#ADBEFF"
      />
      <path
        d="M47.9167 52.0831C53.6696 52.0831 58.3337 56.7471 58.3337 62.5001H37.4997C37.4997 56.7471 42.1637 52.0831 47.9167 52.0831ZM47.9167 37.5001C51.3684 37.5001 54.1667 40.2983 54.1667 43.7501C54.1666 47.2018 51.3684 50.0001 47.9167 50.0001C44.4649 50.0001 41.6667 47.2018 41.6667 43.7501C41.6667 40.2983 44.4649 37.5001 47.9167 37.5001Z"
        fill="var(--_swatch---swatch--brand-blue-600)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M47.9167 70.8333C59.4226 70.8333 68.75 61.5059 68.75 50C68.75 38.4941 59.4226 29.1667 47.9167 29.1667C36.4107 29.1667 27.0833 38.4941 27.0833 50C27.0833 61.5059 36.4107 70.8333 47.9167 70.8333ZM47.9167 85.4167C67.4768 85.4167 83.3333 69.5601 83.3333 50C83.3333 30.4399 67.4768 14.5833 47.9167 14.5833C28.3566 14.5833 12.5 30.4399 12.5 50C12.5 69.5601 28.3566 85.4167 47.9167 85.4167Z"
        fill="#E0E6FF"
      />
      <path
        d="M7.94748e-08 13.7943L10.3209 8.33333L10.4167 18.75L7.94748e-08 13.7943Z"
        fill="#ADBEFF"
      />
      <path
        d="M63.5441 11.6967C62.826 12.1 62.0348 12.3581 61.2161 12.456C60.3974 12.554 59.5673 12.4899 58.7736 12.2674C57.9799 12.0449 57.2382 11.6684 56.5913 11.1596C55.9443 10.6509 55.4049 10.0198 55.0039 9.30276C54.1754 7.87401 53.9508 6.17642 54.3793 4.58293C54.8078 2.98945 55.8545 1.63041 57.2893 0.80438C58.0074 0.401027 58.7986 0.142954 59.6173 0.0450082C60.436 -0.0529377 61.2661 0.0111771 62.0598 0.233664C62.8535 0.45615 63.5951 0.832616 64.2421 1.3414C64.889 1.85019 65.4285 2.48126 65.8294 3.19829C66.6579 4.62704 66.8826 6.32463 66.4541 7.91812C66.0256 9.5116 64.9789 10.8706 63.5441 11.6967Z"
        fill="#FFA702"
      />
      <path
        d="M77.0833 3.125L73.9484 6.25L70.8333 3.125L73.9484 0L77.0833 3.125Z"
        fill="var(--_swatch---swatch--brand-blue-600)"
      />
    </svg>
  )
}

export default EspaceIllustration
