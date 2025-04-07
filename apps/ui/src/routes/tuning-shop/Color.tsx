export default function Color({ color, onClick }: { color: string; onClick: (color: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        onClick(color);
      }}
      className="h-6 rounded border border-bg-border"
      style={{ backgroundColor: color }}
    ></button>
  );
}
