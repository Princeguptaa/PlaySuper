export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function formatCoins(amount: number): string {
  return new Intl.NumberFormat('en-IN').format(amount);
}

export function generateCouponCode(brand: string, value: number): string {
  const brandPrefix = brand.substring(0, 3).toUpperCase().padEnd(3, 'X');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PS-${brandPrefix}${value}-${randomSuffix}`;
}

export function vibrate(duration: number = 50) {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(duration);
    }
  } catch (e) {
    // Ignore
  }
}
