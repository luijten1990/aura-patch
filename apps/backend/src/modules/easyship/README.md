# Easyship international checkout

This provider provides a live, USD delivered-duty-paid (DDP) shipping quote for addresses outside the US. The customer pays the live checkout amount, including quoteable import duties and taxes, so they should not receive a separate delivery charge.

Configure `EASYSHIP_API_TOKEN` plus the factual customs description, declared value, and packed dimensions in `.env`. Then add `fp_easyship_easyship` to the US warehouse and make a calculated-price, non-US shipping option in Medusa Admin using `easyship-international`.

Before going live, configure the label-purchase credentials and webhook in Easyship. This initial integration deliberately makes the checkout quote available first; labels should not be enabled until an Easyship test shipment has successfully generated its customs documents. A customs HS code is still required for reliable DDP quotes.
