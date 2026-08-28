export const SHOP_NAME = "S.K. Jewellers, नेहला";
export const SHOP_PHONE = "9896102704";

export function whatsappLink(phone: string, message: string) {
  const targetPhone = phone || SHOP_PHONE;
  return `https://wa.me/91${targetPhone}?text=${encodeURIComponent(message)}`;
}
