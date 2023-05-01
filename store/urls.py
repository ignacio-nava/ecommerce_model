from django.urls import path

from . import views

app_name = 'store'
urlpatterns = [
    # path('', views.ProductListView.as_view(), name='product_all'),
    path('', views.ProductHomeView.as_view(), name='product_all'),
    path('category/<slug:slug>', views.ByCategoryListView.as_view(), name='category_list'),
    path('<slug:slug>', views.ProductDetailView.as_view(), name='product_detail'),
    path('create/', views.ProductCreateView.as_view(), name='product_create'),
    path('update/<slug:slug>', views.ProductUpateView.as_view(), name='product_update')
]
