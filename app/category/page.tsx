import Link from "next/link";
import { PageHero } from "../components/page-hero";
import { RouteShell } from "../components/route-shell";
import { categories } from "../components/site-data";

export default function CategoryPage() {
  return (
    <RouteShell>
      <main>
        <PageHero
          eyebrow="BROWSE BY SPACE"
          title={
            <>
              Find your <i>feeling.</i>
            </>
          }
          copy="Start with the room, then find the pieces that make it yours."
          image="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1800&q=85"
        />
        <section className="route-section category-route-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CURATED COLLECTIONS</p>
              <h2>Rooms with a point of view.</h2>
            </div>
          </div>
          <div className="route-category-grid">
            {categories.map(([name, copy, image]) => (
              <Link
                className="route-category-card"
                href={`/shop?category=${encodeURIComponent(name)}`}
                key={name}
              >
                <div style={{ backgroundImage: `url(${image})` }} />
                <div>
                  <span className="eyebrow">{name}</span>
                  <h3>{copy}</h3>
                  <span className="text-link">
                    Explore collection{" "}
                    <i className="icon fa-solid fa-arrow-right" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </RouteShell>
  );
}
