export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  tag?: string;
  originalPrice?: number;
};

export const products: Product[] = [
  { id: 1, name: "Mazi Upholstery Storage Double Bed", category: "Bedroom", price: 68000, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85", description: "A generous upholstered bed with considered storage beneath.", tag: "Bestseller" },
  { id: 2, name: "Zort 6 Seater Sofa Set", category: "Living Room", price: 255000, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85", description: "Deep, welcoming seating for long conversations and slow evenings.", tag: "New" },
  { id: 3, name: "Stace Center Table", category: "Living Room", price: 38000, image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=900&q=85", description: "A sculptural centre table in warm natural wood." },
  { id: 4, name: "Felicity Eight Seater Dining Table Set", category: "Dining Room", price: 115000, image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=85", description: "Made for generous meals and the people who stay after them." },
  { id: 5, name: "Almond Cane Accent Chair", category: "Living Room", price: 42000, originalPrice: 48000, image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=85", description: "Cane detailing and a softly curved frame for a favourite corner.", tag: "20% off" },
  { id: 6, name: "Haven Six Drawer Dresser", category: "Bedroom", price: 74000, image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=85", description: "Quietly capacious storage with a tactile walnut finish." },
  { id: 7, name: "Nora Walnut Work Desk", category: "Office", price: 56000, image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=85", description: "A focused, beautiful place to get good work done." },
  { id: 8, name: "Oriel Open Shelf Unit", category: "Storage", price: 31000, image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=85", description: "Open shelving for books, objects, and everyday rituals." },
];

export const categories = [
  ["Bedroom", "Quiet forms for better rest.", "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=700&q=80"],
  ["Living Room", "Make room for good company.", "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=80"],
  ["Dining Room", "Gather around something beautiful.", "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=700&q=80"],
  ["Office", "A little more focus, made comfortable.", "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80"],
  ["Storage", "Order for the things you love.", "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=700&q=80"],
  ["Decor", "The details make the room.", "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80"],
] as const;

export const money = (value: number) => `Rs. ${value.toLocaleString("en-PK")}`;
