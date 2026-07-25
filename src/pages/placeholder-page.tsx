export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-6">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground mt-2 text-sm">Esta tela é construída na próxima fase.</p>
    </div>
  );
}
