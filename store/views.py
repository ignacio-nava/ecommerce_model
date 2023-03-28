from random import randint

from django.views.generic import ListView, DetailView, View
from django.views.generic.edit import CreateView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.shortcuts import render
from utils.paginator import get_pages_to_display


from .models import Category, Product


class ProductHomeView(View):
    model = Product
    template_name = 'store/product_list.html'

    def get(self, request):
        offers_products = Product.objects.order_by('?')[0:12]
        for product in offers_products:
            discount = randint(5,20)
            product.offer_price = round(product.price * (100 - discount) / 100, 2)
            product.discount = discount
        context = {
            'offers_products': offers_products
        }
        return render(request, self.template_name, context)


# class ProductListView(ListView):
#     paginate_by = 10
#     model = Product
#     context_object_name = 'products'
#     template_name = 'store/product_list.html'
#     success_message = "success message"

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         current_page = context['page_obj'].number
#         num_pages = context['page_obj'].paginator.num_pages
#         context['pages'] = get_pages_to_display(num_pages, 5, current_page)
#         context['featured_products'] = Product.objects.order_by('?')[0:12]
#         return context


class ProductDetailView(DetailView):
    model = Product
    context_object_name = 'product'

class ProductCreateView(LoginRequiredMixin, CreateView):
    model = Product
    success_url = reverse_lazy('store:product_all')
    fields = [
        'category',
        'title',
        'author',
        'price',
        'in_stock',
        'image'
    ]

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super(ProductCreateView, self).form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['submit_action'] = self.request.path.split('/')[1]
        return context

class ProductUpateView(LoginRequiredMixin, UpdateView):
    model = Product
    success_url = reverse_lazy('store:product_all')
    fields = [
        'category',
        'title',
        'author',
        'price',
        'in_stock',
        'image'
    ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['submit_action'] = self.request.path.split('/')[1]
        return context
