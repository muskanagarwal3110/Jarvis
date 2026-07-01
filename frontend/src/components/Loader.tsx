export function Loader() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl border border-[#C1622D]/15 bg-[#F2E8DC] px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#C1622D] [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#C1622D] [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#C1622D]" />
      </div>
    </div>
  );
}