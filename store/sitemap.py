from django.contrib import sitemaps
from django.urls import reverse

from .models import Category, Product


class StoreViewSitemap(sitemaps.Sitemap):
    priority = 0.9
    changefreq = 'daily'

    def items(self):
        return ['store:product_all',]

    def location(self, item):
        return reverse(item)


class CategoryViewSitemap(sitemaps.Sitemap):
    changefreq = "weekly"
    priority = 0.7

    def items(self):
        return Category.objects.all()


class ProductViewSitemap(sitemaps.Sitemap):
    changefreq = "weekly"
    priority = 0.7

    def items(self):
        return Product.objects.all()
