type ToastCallback = (badgeIds: string[]) => void;
let _callback: ToastCallback | null = null;

export function registerToastCallback(cb: ToastCallback): void {
  _callback = cb;
}

export function fireAchievementToast(badgeIds: string[]): void {
  if (badgeIds.length > 0) _callback?.(badgeIds);
}
