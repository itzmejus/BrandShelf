import { useEffect } from 'react'

/** Locks page scrolling behind an open modal/drawer, restoring it on close/unmount. */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [locked])
}
