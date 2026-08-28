export type PaymentMode = "Cash" | "UPI";
export type Item = { id: number; name: string; variety: string; category: string; weight: string; purity: string; price: number; stock?: string; };
export type Order = { id: number; customerName: string; customerMobile?: string; customerAddress?: string; item: string; quantity: number; amount: number; paymentMode: PaymentMode; time: string; };
