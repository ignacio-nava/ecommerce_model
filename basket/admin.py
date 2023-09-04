from django.contrib import admin

from .models import (
    Item,
    ShippingMethod,
    Order
)


class ItemInline(admin.TabularInline):

    model = Item
    # esto es porque no quiero una lista de productos, solo el id del producto
    raw_id_fields = ["each_product"]
    extra = 0
    fieldsets = [
        (
            'Items',
            {
                "fields": [
                    "each_product",
                    "quantity",
                    "single_price",
                ]
            }
        )
    ]
    readonly_fields = [
        "each_product",
        "quantity",
        "single_price",

    ]

    def has_change_permission(self, request, obj=None):
        return False


class OrderAdmin(admin.ModelAdmin):

    fieldsets = [
        (
            "Order Data",
            {
                "fields": [
                    "order_status",
                    "base_price",
                    "shipping_Method",
                    "total_price",
                    "payment_method",
                    "created_at",
                    "updated_at",
                ]
            },
        ),
        (
            "Recipient's Data",
            {
                "fields": [
                    "user",
                    "dni",
                    "first_name",
                    "last_name",
                    "address",
                    "state",
                    "city",
                ]
            },
        )
    ]
    list_display = [
        "id",
        "order_status",
        "total_price",
        "user",
        "created_at",
        "updated_at",
    ]
    readonly_fields = [
        "order_status",
        "base_price",
        "shipping_Method",
        "total_price",
        "user",
        "first_name",
        "last_name",
        "address",
        "state",
        "city",
        "dni",
        "payment_method",
        "created_at",
        "updated_at",
    ]

    list_filter = [
        "status",
        "created_at",
        "updated_at",
    ]  # "fecha"

    search_fields = ["first_name", "dni"]
    inlines = [ItemInline]
    actions = ["order_send"]

    def order_send(self, request, queryset):
        queryset.update(satus="DISPATCHED")

    order_send.short_description = "Dispatched"


admin.site.register(ShippingMethod)
admin.site.register(Order, OrderAdmin)
