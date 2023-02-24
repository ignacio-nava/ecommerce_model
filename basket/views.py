from decimal import Decimal

from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse

from .basket import Basket

from store.models import Product


def basket_summary(request):
    basket = Basket(request)
    return render(request, 'basket/summary.html', {'basket': basket})

def basket_add(request):
    basket = Basket(request)
    if request.POST.get('action') == 'post':
        product_id = int(request.POST.get('productId'))
        product = get_object_or_404(Product, id=product_id)
        product_qty = int(request.POST.get('productQty'))

        basket.add(product=product, qty=product_qty)
        return JsonResponse({
            'basket': {
                'qty': basket.__len__()
            }
        })

def basket_update(request):
    basket = Basket(request)
    if request.POST.get('action') == 'post':
        product_id = int(request.POST.get('productId'))
        product = get_object_or_404(Product, id=product_id)
        qty = int(request.POST.get('productQty'))

        basket.update(product, qty)

        return JsonResponse({
            'qty': basket.__len__(),
            'totalItemPrice': basket.get_item_price_sum(product),
            'totalPrice': basket.get_total_price()
        })

def basket_delete(request):
    basket = Basket(request)
    if request.POST.get('action') == 'post':
        product_id = int(request.POST.get('productId'))
        product = get_object_or_404(Product, id=product_id)

        basket.delete(product)

        items = []
        for item in basket:
            items.append({
                'product': {
                    'id': item['product'].id,
                    'title': item['product'].title,
                    'image': str(item['product'].image),
                    'image_external': str(item['product'].image_external)
                },
                'totalItemPrice': item['total_item_price'],
                'totalItemQty': item['total_item_qty']
            })

        return JsonResponse({
            'items': items,
            'qty': basket.__len__(),
            'totalPrice': basket.get_total_price()
        })
