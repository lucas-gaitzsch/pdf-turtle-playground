export const createDebounce = () => {
  let timeout: number | null = null

  return (func: () => unknown, delayMs = 500) => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func()
    }, delayMs)
  }
}
