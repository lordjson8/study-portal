export function delay(ms: number = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
