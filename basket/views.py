import json

from decimal import Decimal
from typing import Any, Optional

from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.sites.shortcuts import get_current_site
from django.db import models
from django.urls import reverse
from django.template.loader import render_to_string
from django.shortcuts import redirect, render, get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.generic import DetailView

from .models import Item, Order
from .basket import Basket
from .forms import OrderForm, PayMentMethodForm

from account.models import UserBase
from store.models import Product


def basket_summary(request):
    basket = Basket(request)

    if request.method == 'POST':
        if not request.user.is_authenticated:
            return redirect(f"{settings.LOGIN_URL}?next={request.path}")

        form = OrderForm(request.POST)
        if not form.is_valid():
            context = {
                'basket': basket,
                'form': form
            }
            return render(request, 'basket/summary.html', context)

        order = form.save(commit=False)

        #  Form Values
        order.user = UserBase.objects.get(pk=request.user.id)
        order.first_name = form.cleaned_data['first_name']
        order.last_name = form.cleaned_data['last_name']
        order.state = form.cleaned_data['state']
        order.city = form.cleaned_data['city']
        order.address = form.cleaned_data['address']
        order.dni = form.cleaned_data['dni']
        order.shipping_method = form.cleaned_data['shipping_method']

        order.total = basket.get_total_price()
        order.total_with_shipping = order.total + order.shipping_method.get_price()

        order.save()

        for item in basket:
            item_in_order = Item.objects.create(
                order=order,
                each_product=item['product'],
                quantity=item['total_item_qty'],
                price=Decimal(item['product'].price * item['total_item_qty'])
            )
            item_in_order.save()

        basket.clear_basket()

        return redirect(reverse('basket:order', args=[order.id]))

    form = OrderForm()
    context = {
        'basket': basket,
        'form': form
    }
    return render(request, 'basket/summary.html', context)


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

    if request.method == 'POST':
        body = json.loads(request.body)

        try:
            product_id = int(body.get('productId'))
            product_qty = int(body.get('productQty'))
        except (ValueError, TypeError):
            return HttpResponseBadRequest('Bad Request')

        product = get_object_or_404(Product, id=product_id)

        basket.update(product, product_qty)

        return JsonResponse({
            'basketQty': basket.__len__(),
            'totalItemPrice': basket.get_item_price_sum(product),
            'totalPrice': basket.get_total_price(),
            'itemQty': basket.get_product_count(product)
        })


def basket_delete(request):
    basket = Basket(request)

    if request.method == 'POST':
        body = json.loads(request.body)
        try:
            product_id = int(body.get('productId'))
        except (ValueError, TypeError):
            return HttpResponseBadRequest('Bad Request')

        product = get_object_or_404(Product, id=product_id)

        basket.delete(product)

        items = []
        for item in basket:
            items.append({
                'product': {
                    'id': item['product'].id,
                    'title': item['product'].title,
                    'price': item['product'].price,
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


class OrderView(LoginRequiredMixin, DetailView):
    model = Order
    template_name = 'basket/order.html'

    def get(self, request, pk):
        order = self.model.objects.get(pk=pk)

        # Check if order's owner is auth user
        if order.user != self.request.user:
            return redirect('store:product_all')

        items = Item.objects.filter(order__pk=order.pk)

        context = {
            'order': order,
            'items': items
        }

        if order.status == "TO BE CONFIRMED":
            form = PayMentMethodForm()
            context['form'] = form

        return render(request, self.template_name, context)

    def post(self, request, pk=None):
        order = get_object_or_404(self.model, id=pk, user=self.request.user)
        items = Item.objects.filter(order__pk=order.pk)
        context = {
            'order': order,
            'items': items
        }

        form = PayMentMethodForm(request.POST)
        if not form.is_valid():
            context['form'] = form
            return render(request, self.template_name, context)

        # Update Order
        payment_method = form.cleaned_data['payment_method']
        order.payment_method = payment_method
        order.status = "DISPATCHED"
        order.save()

        # Send Email
        user = UserBase.objects.get(pk=self.request.user.id)
        current_site = get_current_site(request)
        subject = 'Thank you for your Purchase'
        context["user"] = user
        context['domain'] = current_site.domain
        body = render_to_string(
            'basket/purchase_email.html',
            context
        )
        user.email_user(subject=subject, body=body)
        return redirect(reverse('basket:order', args=[order.id]))
