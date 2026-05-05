import { useCallback, useState } from "react"
import type { MenuEntry, MenuTab, MenuSection } from "../NavigationMenu.types"

export type StackFrame =
  | { kind: "root" }
  | { kind: "entry"; entry: MenuEntry }
  | { kind: "tab"; entry: MenuEntry; tab: MenuTab }
  | { kind: "section"; entry: MenuEntry; tab?: MenuTab; section: MenuSection }

export function useMenuStack() {
  const [stack, setStack] = useState<StackFrame[]>([{ kind: "root" }])

  const push = useCallback((frame: StackFrame) => {
    setStack((s) => [...s, frame])
  }, [])

  const pop = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s))
  }, [])

  const reset = useCallback(() => {
    setStack([{ kind: "root" }])
  }, [])

  const current = stack[stack.length - 1]
  const depth = stack.length - 1

  return { stack, current, depth, push, pop, reset }
}
