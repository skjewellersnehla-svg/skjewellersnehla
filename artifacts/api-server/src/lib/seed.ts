import { db, productsTable } from "@workspace/db";

const ringArtwork = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs><radialGradient id="bg"><stop stop-color="#5f4a2c"/><stop offset="1" stop-color="#161617"/></radialGradient><linearGradient id="gold"><stop stop-color="#f7dc8c"/><stop offset=".5" stop-color="#9b6c24"/><stop offset="1" stop-color="#ffedaa"/></linearGradient></defs>
  <rect width="600" height="600" fill="url(#bg)"/><circle cx="300" cy="325" r="145" fill="none" stroke="url(#gold)" stroke-width="35"/><path d="M230 225 270 155h60l40 70-70 44z" fill="#f9e8b2" stroke="#b47b25" stroke-width="7"/><path d="m300 170 24 48-24 30-24-30z" fill="#fff8db"/><circle cx="300" cy="325" r="10" fill="#f5c967"/>
</svg>`);
const necklaceArtwork = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs><radialGradient id="bg"><stop stop-color="#60462f"/><stop offset="1" stop-color="#181719"/></radialGradient><linearGradient id="gold"><stop stop-color="#ffe39a"/><stop offset=".5" stop-color="#a06f29"/><stop offset="1" stop-color="#f7d273"/></linearGradient></defs>
  <rect width="600" height="600" fill="url(#bg)"/><path d="M95 155c70 240 340 240 410 0" fill="none" stroke="url(#gold)" stroke-width="15"/><g fill="#f8e6ae" stroke="#ad7629" stroke-width="5"><circle cx="150" cy="250" r="24"/><circle cx="195" cy="310" r="27"/><circle cx="245" cy="355" r="30"/><circle cx="300" cy="375" r="37"/><circle cx="355" cy="355" r="30"/><circle cx="405" cy="310" r="27"/><circle cx="450" cy="250" r="24"/></g><path d="M300 335 342 410l-42 70-42-70z" fill="#fff5ce" stroke="#d8aa4a" stroke-width="7"/>
</svg>`);
const bangleArtwork = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs><radialGradient id="bg"><stop stop-color="#624a32"/><stop offset="1" stop-color="#171719"/></radialGradient><linearGradient id="gold"><stop stop-color="#ffe7a0"/><stop offset=".5" stop-color="#99651f"/><stop offset="1" stop-color="#f6cf68"/></linearGradient></defs>
  <rect width="600" height="600" fill="url(#bg)"/><g fill="none" stroke="url(#gold)" stroke-width="24"><ellipse cx="300" cy="330" rx="190" ry="110"/><ellipse cx="300" cy="330" rx="160" ry="88"/><ellipse cx="300" cy="330" rx="130" ry="68"/></g><path d="M175 310c45-75 205-95 260 10" fill="none" stroke="#fff1c1" stroke-width="12"/><circle cx="300" cy="220" r="25" fill="#f9e8b2" stroke="#a46e22" stroke-width="7"/>
</svg>`);

const seedProductsData = [
  {
    productId: "SK-RG-001",
    name: "Aadhya Diamond Ring",
    karat: "22K",
    weight: 4.8,
    price: 245000,
    stock: 3,
    imageUrl: `data:image/svg+xml,${ringArtwork}`,
  },
  {
    productId: "SK-NK-002",
    name: "Meher Heritage Haar",
    karat: "22K",
    weight: 48,
    price: 245000,
    stock: 2,
    imageUrl: `data:image/svg+xml,${necklaceArtwork}`,
  },
  {
    productId: "SK-BG-003",
    name: "Saanvi Gold Bangle",
    karat: "22K",
    weight: 32,
    price: 178500,
    stock: 5,
    imageUrl: `data:image/svg+xml,${bangleArtwork}`,
  },
];

export async function seedProducts() {
  const existing = await db.select({ id: productsTable.id }).from(productsTable).limit(1);
  if (existing.length > 0) return;
  await db.insert(productsTable).values(seedProductsData);
}