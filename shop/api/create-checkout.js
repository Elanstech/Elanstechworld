/**
 * ═══════════════════════════════════════════════════════════════
 *  ETW SHOP — Square Checkout Link Creator
 *  Vercel Serverless Function
 *  File: api/create-checkout.js
 *
 *  Receives cart items from the frontend, creates a Square
 *  payment link, and returns the checkout URL.
 *
 *  ENV VARIABLES (set in Vercel dashboard):
 *    SQUARE_ACCESS_TOKEN  — your production access token
 *    SQUARE_LOCATION_ID   — your location ID
 * ═══════════════════════════════════════════════════════════════
 */

export default async function handler(req, res) {
  // ── CORS headers (allow your shop domain) ──
  res.setHeader('Access-Control-Allow-Origin', 'https://www.elanstechworld.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, redirectUrl } = req.body;

    // Validate
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // Build line items for Square
    // Each item needs: name, quantity, price (in cents)
    const lineItems = items.map(item => ({
      name: item.name,
      quantity: String(item.qty),
      base_price_money: {
        amount: item.price * 100,  // Square uses cents
        currency: 'USD',
      },
      note: item.variant || '',
    }));

    // Create the checkout link via Square API
    const response = await fetch('https://connect.squareup.com/v2/online-checkout/payment-links', {
      method: 'POST',
      headers: {
        'Square-Version': '2024-12-18',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        quick_pay: lineItems.length === 1 ? {
          name: lineItems[0].name,
          price_money: {
            amount: lineItems[0].base_price_money.amount,
            currency: 'USD',
          },
          location_id: process.env.SQUARE_LOCATION_ID,
        } : undefined,
        order: lineItems.length > 1 ? {
          location_id: process.env.SQUARE_LOCATION_ID,
          line_items: lineItems,
        } : undefined,
        checkout_options: {
          allow_tipping: false,
          redirect_url: redirectUrl || 'https://www.elanstechworld.com/shop/?order=success',
          ask_for_shipping_address: true,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Square API error:', JSON.stringify(data));
      return res.status(500).json({
        error: 'Failed to create checkout',
        detail: data.errors?.[0]?.detail || 'Unknown error',
      });
    }

    // Return the checkout URL
    return res.status(200).json({
      url: data.payment_link.url,
      orderId: data.payment_link.order_id,
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
