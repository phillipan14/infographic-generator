"use client";

interface Props {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
  width: number;
  height: number;
}

export default function Preview({
  imageUrl,
  loading,
  error,
  width,
  height,
}: Props) {
  const aspectRatio = width / height;

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-zinc-900 rounded-xl border border-red-900/50">
        <div className="text-center px-8">
          <p className="text-red-400 text-sm font-medium mb-1">Generation failed</p>
          <p className="text-red-400/70 text-xs">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin mb-3" />
          <p className="text-zinc-500 text-sm">Generating your infographic...</p>
          <p className="text-zinc-600 text-xs mt-1">This may take 10-30 seconds</p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="text-center px-8">
          <p className="text-zinc-600 text-sm">Your infographic will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 flex justify-center">
        <img
          src={imageUrl}
          alt="Generated infographic"
          className="max-w-full max-h-[70vh] rounded-lg shadow-2xl"
          style={{ aspectRatio }}
        />
      </div>
      <a
        href={imageUrl}
        download="infographic.png"
        className="block w-full text-center bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm"
      >
        Download PNG
      </a>
    </div>
  );
}
