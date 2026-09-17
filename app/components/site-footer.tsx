import Link from "next/link";

export function SiteFooter() {
  return <footer className="route-footer">
    <div className="footer-main">
      <div><Link href="/" className="brand footer-brand"><span className="brand-mark">M</span><span>Muntazir <em>&</em> Sons <small>FURNITURE</small></span></Link><p>Considered furniture for the way you live, from our workshop in Peshawar.</p><a className="footer-contact" href="mailto:hello@muntazirandsons.com">hello@muntazirandsons.com</a></div>
      <div className="footer-links"><div><strong>Explore</strong><Link href="/shop">All pieces</Link><Link href="/category">Shop by category</Link><Link href="/deals">Current deals</Link></div><div><strong>Visit</strong><span>University Road, Peshawar</span><a href="tel:+92915273555">+92 91 527 3555</a><Link href="/contact">Contact studio</Link></div></div>
    </div>
    <div className="footer-bottom"><span>© 2026 Muntazir & Sons Furniture</span><span>Made for living well.</span></div>
  </footer>;
}
