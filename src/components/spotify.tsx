export function Spotify({ id, title, tall = false }: { id: string; title: string; tall?: boolean }) {
  return (
    <iframe
      title={title}
      src={`https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`}
      width="100%"
      height={tall ? 352 : 152}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="border-0 bg-ink"
    />
  );
}

export function Youtube({ id, title }: { id: string; title: string }) {
  return (
    <div className="aspect-video w-full bg-ink">
      <iframe
        title={title}
        src={`https://www.youtube.com/embed/videoseries?list=${id}`}
        width="100%"
        height="100%"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="h-full w-full border-0"
      />
    </div>
  );
}
