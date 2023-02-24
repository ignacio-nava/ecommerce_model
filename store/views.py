from django.views.generic import ListView, DetailView
from django.views.generic.edit import CreateView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy


from .models import Category, Product


class ProductListView(ListView):
    paginate_by = 10
    model = Product
    context_object_name = 'products'
    success_message = "success message"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        print(dir(context['page_obj']))
        return context

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
