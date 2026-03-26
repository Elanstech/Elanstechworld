/**
 * ═══════════════════════════════════════════════════════════════
 *  ETW SHOP — Square Checkout Link Creator
 *  Vercel Serverless Function  ·  With Shipping Tiers
 *  File: api/create-checkout.js  (repo root)
 *
 *  ENV VARIABLES (Vercel dashboard):
 *    SQUARE_ACCESS_TOKEN  — starts with sq0atp-
 *    SQUARE_LOCATION_ID   — starts with L
 *
 *  Tax is configured in Square Dashboard, applied automatically.
 * ═══════════════════════════════════════════════════════════════
 */

export default async function handler(req, res) {

  // ── CORS ──
  const allowed = [
    'https://www.elanstechworld.com',
    'https://elanstechworld.com',
  ];
  const origin = req.headers.origin;
  if (allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items, shipping, redirectUrl } = req.body;

    // ── Validate ──
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }
    if (!shipping || !['nyc', 'standard'].includes(shipping)) {
      return res.status(400).json({ error: 'Invalid shipping option' });
    }

    // ── Build product line items ──
    const lineItems = items.map(item => ({
      name: item.name,
      quantity: String(item.qty),
      base_price_money: {
        amount: Math.round(item.price * 100),
        currency: 'USD',
      },
      note: item.variant || '',
    }));

    // ── Add shipping as a line item ──
    const shippingFee = shipping === 'nyc' ? 7900 : 999; // cents
    const shippingLabel = shipping === 'nyc'
      ? 'NYC Same-Day Delivery'
      : 'Standard Shipping (3–5 business days)';

    lineItems.push({
      name: shippingLabel,
      quantity: '1',
      base_price_money: {
        amount: shippingFee,
        currency: 'USD',
      },
      note: 'Shipping',
    });

    // ── Build Square request ──
    const body = {
      idempotency_key: crypto.randomUUID(),
      order: {
        location_id: process.env.SQUARE_LOCATION_ID,
        line_items: lineItems,
      },
      checkout_options: {
        allow_tipping: false,
        redirect_url: redirectUrl || 'https://www.elanstechworld.com/shop/?order=success',
        ask_for_shipping_address: true,
        accepted_payment_methods: {
          apple_pay: true,
          google_pay: true,
          cash_app_pay: true,
          afterpay_clearpay: true,
        },
      },
    };

    // ── Call Square API ──
    const response = await fetch(
      'https://connect.squareup.com/v2/online-checkout/payment-links',
      {
        method: 'POST',
        headers: {
          'Square-Version': '2024-12-18',
          'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Square error:', JSON.stringify(data));
      return res.status(500).json({
        error: 'Failed to create checkout',
        detail: data.errors?.[0]?.detail || 'Unknown Square error',
      });
    }

    return res.status(200).json({
      url: data.payment_link.url,
      orderId: data.payment_link.order_id,
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
