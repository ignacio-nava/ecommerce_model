from random import randint

from django.core.paginator import Paginator
from django.views.generic import ListView, DetailView, View
from django.views.generic.edit import CreateView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.shortcuts import render, get_object_or_404
from utils.paginator import get_pages_to_display

from .models import Category, Product


class ProductHomeView(View):
    model = Product
    template_name = 'store/home_page.html'

    def get(self, request):
        categories = Category.objects.all().order_by('name')
        offers_products = Product.objects.order_by('?')[0:12]
        for product in offers_products:
            discount = randint(5,20)
            product.offer_price = round(product.price * (100 - discount) / 100, 2)
            product.discount = discount
        context = {
            'categories': categories,
            'offers_products': offers_products
        }
        return render(request, self.template_name, context)

class ByCategoryListView(View):
    paginate_by = 10
    model = Product
    context_object_name = 'products'
    template_name = 'store/product_list.html'

    def get(self, request, slug):
        category = Category.objects.get(slug=slug)
        products = self.model.objects.all().filter(category__id=category.id)

        paginator = Paginator(products, self.paginate_by)
        page_number = request.GET.get("page")
        page_obj = paginator.get_page(page_number)

        context = {
            'page_obj': page_obj
        }
        return render(request, self.template_name, context)

# class CategoryListView(ListView):
#     paginate_by = 10
#     model = Product
#     context_object_name = 'products'
#     template_name = 'store/product_list.html'

#     def get_queryset(self):
#         category_query = self.request.path.replace('/by-category/', '')
#         category = get_object_or_404(Category, slug=category_query)
#         queryset = super().get_queryset().filter(category__id=category.id)
#         return queryset

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         print(dir(context['paginator']))
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
