from django.urls import path

from . import views

app_name = 'basket'
urlpatterns = [
    path('', views.basket_summary, name='basket_summary'),
    path('add/', views.basket_add, name='basket_add'),
    path('update/', views.basket_update, name='basket_update'),
    path('delete/', views.basket_delete, name='basket_delete'),
    path('order/<int:pk>/', views.OrderView.as_view(), name='order')
]
