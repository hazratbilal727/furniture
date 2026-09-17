import { PageHero } from "../components/page-hero";
import { ProductGrid } from "../components/product-grid";
import { RouteShell } from "../components/route-shell";

export default function ShopPage() {
  return <RouteShell><main><PageHero eyebrow="THE FULL EDIT" title={<>Furniture with a <i>point of view.</i></>} copy="Explore thoughtful pieces for rooms that feel like you. Every order is delivered with care across Pakistan." image="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85" /><section className="route-section"><div className="section-heading"><div><p className="eyebrow">SHOP ALL PIECES</p><h2>Find your next favourite.</h2><p className="section-intro">From quiet bedroom forms to generous seating, made for living well.</p></div></div><ProductGrid showSearchPanel /></section></main></RouteShell>;
}
