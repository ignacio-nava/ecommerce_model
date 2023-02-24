from decimal import Decimal

from store.models import Product


class Basket():
    """
    A base Basket class, providing some default behaviors that
    can be inherited or overrided, as necessary.
    """

    def __init__(self, request):
        self.session = request.session
        self.basket = self.session['skey'] = self.session.get('skey', {})

    def __iter__(self):
        """
        Collect the product_id in the session data to query the database
        and return products
        """
        for key, value in self.basket.items():
            item = {
                'product': Product.objects.get(id=int(key)),
                'total_item_price': Decimal(value['price']) * Decimal(value['qty']),
                'total_item_qty': int(value['qty'])
            }
            yield item

    def __len__(self):
        """
        Get the basket data and count the qty of items
        """
        return sum(item['qty'] for item in self.basket.values())

    def add(self, product, qty):
        """
        Adding and updating the users basket session data
        """
        product_id = str(product.id)

        if product_id in self.basket:
            self.basket[product_id]['qty'] = self.basket[product_id].get('qty', 0) + qty
        else:
            self.basket[product_id] = {'price': str(product.price), 'qty': qty}

        self.save()

    def update(self, product, qty):
        """
        Update values in session data
        """
        product_id = str(product.id)
        if product_id in self.basket:
            self.basket[product_id]['qty'] = qty
        self.save()

    def delete(self, product):
        """
        Delete item from session data
        """
        product_id = str(product.id)

        if product_id in self.basket:
            del self.basket[product_id]
            print(self.basket)
            self.save()

    def get_total_price(self):
        return sum(Decimal(item['price']) * item['qty'] for item in self.basket.values())

    def get_count_items(self):
        """
        Invoce __len__ | For template usage
        """
        return self.__len__()

    def get_item_price_sum(self, product):
        product_id = str(product.id)

        if product_id in self.basket:
            return Decimal(self.basket[product_id]['price']) * self.basket[product_id]['qty']

    def save(self):
        self.session.modified = True
