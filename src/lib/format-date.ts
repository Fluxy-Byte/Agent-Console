/// "21/09/2026 às 14:30" — data e hora separadas por "às" em vez do
/// "21/09/2026, 14:30:05" do toLocaleString.
export function formatDateAtTime(value: string | Date): string {
  const date = new Date(value);
  const day = date.toLocaleDateString("pt-BR");
  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${day} às ${time}`;
}
