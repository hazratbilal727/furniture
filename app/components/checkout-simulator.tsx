"use client";

import { FormEvent, useState } from "react";

type CheckoutItem = { id: number; name: string; price: number | null; quantity: number };

type CheckoutSimulatorProps = {
  items: CheckoutItem[];
  onClose: () => void;
  onComplete: () => void;
};

const formatMoney = (value: number) => `Rs. ${value.toLocaleString("en-PK")}`;

export function CheckoutSimulator({ items, onClose, onComplete }: CheckoutSimulatorProps) {
  const [completed, setCompleted] = useState(false);
  const subtotal = items.reduce((total, item) => total + (item.price ?? 0) * item.quantity, 0);

  const submitCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCompleted(true);
  };

  return <div className="checkout-simulator-backdrop" role="presentation" onClick={onClose}>
    <section className="checkout-simulator" role="dialog" aria-modal="true" aria-labelledby="checkout-simulator-title" onClick={(event) => event.stopPropagation()}>
      {completed ? <div className="checkout-simulator-success"><span className="checkout-simulator-success-icon">&#10003;</span><p className="eyebrow">SIMULATION COMPLETE</p><h2 id="checkout-simulator-title">Your order is ready.</h2><p>This is a checkout preview only. No payment was processed and no real order was placed.</p><button className="button button-primary" type="button" onClick={() => { onComplete(); onClose(); }}>Back to shopping</button></div> : <>
        <div className="checkout-simulator-heading"><div><p className="eyebrow">SECURE CHECKOUT PREVIEW</p><h2 id="checkout-simulator-title">Complete your order</h2></div><button className="modal-close" type="button" onClick={onClose} aria-label="Close checkout"><span aria-hidden="true">&#10005;</span></button></div>
        <form onSubmit={submitCheckout}>
          <div className="checkout-simulator-grid"><label>Full name<input required name="name" placeholder="Your name" /></label><label>Phone number<input required name="phone" type="tel" placeholder="+92 300 1234567" /></label><label className="checkout-simulator-wide">Delivery address<input required name="address" placeholder="Street address, city" /></label><label>Payment method<select name="payment"><option>Cash on delivery</option><option>Card ending in 4242 (demo)</option><option>Bank transfer (demo)</option></select></label></div>
          <div className="checkout-simulator-summary"><div><span>Items</span><strong>{items.reduce((total, item) => total + item.quantity, 0)}</strong></div><div><span>Subtotal</span><strong>{formatMoney(subtotal)}</strong></div><div><span>Delivery</span><strong>Calculated later</strong></div><div className="checkout-simulator-total"><span>Estimated total</span><strong>{formatMoney(subtotal)}</strong></div></div>
          <p className="checkout-simulator-note">Demo checkout only. Your details are not sent anywhere.</p><button className="button button-primary checkout-simulator-submit" type="submit">Place simulated order <span aria-hidden="true">&#8594;</span></button>
        </form>
      </>}
    </section>
  </div>;
}
