def test_checkout_heading(page):
    page.goto("data:text/html,<title>Checkout</title><h1>Pay</h1>")
    assert page.locator("h1").inner_text() == "Pay"
