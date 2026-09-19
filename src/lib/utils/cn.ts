type ClassValue = string | false | null | undefined;

/** Joins class names, dropping falsy values. Small enough that a dependency is not worth it. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
