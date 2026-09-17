export function PageHero({ eyebrow, title, copy, image }: { eyebrow: string; title: React.ReactNode; copy: string; image?: string }) {
  return <section className="route-hero" style={image ? { backgroundImage: `linear-gradient(90deg, rgba(18, 58, 48, .94), rgba(18, 58, 48, .62)), url(${image})` } : undefined}><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p></div></section>;
}
