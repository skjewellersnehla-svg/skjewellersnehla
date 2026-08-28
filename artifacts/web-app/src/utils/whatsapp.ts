export const SHOP_PHONE = "9896102704";
export const SHOP_NAME = "S.K. Jewellers, नेहला";

export function whatsappLink(phone: string, message: string) {
  const cleanPhone = (phone || "").replace(/[^0-9+]/g, "");
  const encoded = encodeURIComponent(message);
  if (cleanPhone) return `https://wa.me/${cleanPhone}?text=${encoded}`;
  return `https://wa.me/?text=${encoded}`;
}
