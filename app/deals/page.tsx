import { PageHero } from "../components/page-hero";
import { ProductGrid } from "../components/product-grid";
import { RouteShell } from "../components/route-shell";

export default function DealsPage() {
  return (
    <RouteShell>
      <main>
        <PageHero
          eyebrow="THE SEASONAL EDIT"
          title={
            <>
              Good pieces, <i>better prices.</i>
            </>
          }
          copy="A small selection of considered furniture, available for less while this edit lasts."
          image="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1800&q=85"
        />
        <section className="route-section">
          <div className="deal-callout">
            <div>
              <p className="eyebrow">LIMITED TIME ONLY</p>
              <h2>Make room for a little more.</h2>
              <p>
                Enjoy special pricing on pieces selected for their everyday
                comfort and lasting character.
              </p>
            </div>
            <strong>Up to 20% off</strong>
          </div>
          <ProductGrid onlyDeals />
        </section>
      </main>
    </RouteShell>
  );
}
