from basket.models import ShippingMethod

SHIPPING_METHODS = [
    ("Method A", 100),
    ("Method B", 250),
    ("Method C", 300)
]


def run():
    print(f'Loading Shipping Methods...', end='\r')
    for method in SHIPPING_METHODS:
        name, price = method
        shipping_method = ShippingMethod.objects.create(
            name=name,
            price=price
        )
    print(f'Loading Shipping Methods...', end=f' \033[1;32mOK\033[0m\n')
    return
