export function letterGrade(percent: number): string {
  if (percent >= 70) return "A";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C";
  if (percent >= 45) return "D";
  if (percent >= 40) return "E";
  return "F";
}
