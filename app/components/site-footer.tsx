import Link from "next/link";

const socialLinks = [
  { href: "https://www.instagram.com", label: "Instagram", icon: "fa-brands fa-instagram" },
  { href: "https://www.facebook.com", label: "Facebook", icon: "fa-brands fa-facebook-f" },
  { href: "https://x.com", label: "X", icon: "fa-brands fa-x-twitter" },
  { href: "https://www.youtube.com", label: "YouTube", icon: "fa-brands fa-youtube" },
];

export function SiteFooter() {
  return (
    <footer className="route-footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <Link href="/" className="brand footer-brand">
            <span className="brand-mark">M</span>
            <span>
              Muntazir <em>&</em> Sons <small>FURNITURE</small>
            </span>
          </Link>
          <p>
            Furniture with a point of view.
            <br />
            Peshawar, Pakistan.
          </p>
          <a className="footer-contact" href="mailto:hello@muntazirandsons.com">
            hello@muntazirandsons.com
          </a>
        </div>

        <div className="footer-links">
          <div>
            <strong>Explore</strong>
            <Link href="/shop">All pieces</Link>
            <Link href="/category">Shop by category</Link>
            <Link href="/deals">Current deals</Link>
            <Link href="/about">Our story</Link>
          </div>

          <div>
            <strong>Visit us</strong>
            <span>University Road</span>
            <span>Peshawar, KPK</span>
            <a href="tel:+92915273555">+92 91 527 3555</a>
            <Link href="/contact">Contact studio</Link>
          </div>

          <div>
            <strong>Follow along</strong>
            <div className="socials">
              {socialLinks.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                >
                  <i className={icon} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Muntazir & Sons Furniture</span>
        <span>Designed for living well · Privacy · Terms</span>
      </div>
    </footer>
  );
}
