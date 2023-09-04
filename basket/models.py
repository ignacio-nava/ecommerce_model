from decimal import Decimal

from django.db import models
from django.utils.html import format_html

from account.models import UserBase
from store.models import Product


class ShippingMethod(models.Model):
    name = models.CharField(
        max_length=50,
        blank=False,
        null=False
    )
    price = models.IntegerField(
        blank=False,
        null=False
    )

    def __str__(self):
        return self.name

    def get_price(self):
        return Decimal(self.price)


class Order(models.Model):
    ORDER_STATUS = [
        ("TO BE CONFIRMED", "TO BE CONFIRMED"),
        ("NOT ACCREDITED", "NOT ACCREDITED"),
        ("ACCREDITED", "ACCREDITED"),
        ("BILLED", "BILLED"),
        ("DISPATCHED", "DISPATCHED"),
    ]

    PAYMENTS = [
        ('Transferencia', 'Transferencia'),
        ('PayPal', 'PayPal'),
        ('MercadoPago', 'MercadoPago')
    ]

    STATES = [
        ("Buenos Aires", "Buenos Aires"),
        ("Capital Federal", "Capital Federal"),
        ("Catamarca", "Catamarca"),
        ("Chaco", "Chaco"),
        ("Chubut", "Chubut"),
        ("Córdoba", "Córdoba"),
        ("Corrientes", "Corrientes"),
        ("Entre Ríos", "Entre Ríos"),
        ("Formosa", "Formosa"),
        ("Jujuy", "Jujuy"),
        ("La Pampa", "La Pampa"),
        ("La Rioja", "La Rioja"),
        ("Mendoza", "Mendoza"),
        ("Misiones", "Misiones"),
        ("Neuquén", "Neuquén"),
        ("Río Negro", "Río Negro"),
        ("Salta", "Salta"),
        ("San Juan", "San Juan"),
        ("San Luis", "San Luis"),
        ("Santa Cruz", "Santa Cruz"),
        ("Santa Fe", "Santa Fe"),
        ("Santiago del Estero", "Santiago del Estero"),
        ("Tierra del Fuego", "Tierra del Fuego"),
        ("Tucumán", "Tucumán"),
    ]

    user = models.ForeignKey(
        UserBase,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    state = models.CharField(
        max_length=50,
        default='',
        choices=STATES,
        blank=False,
        null=False
    )
    city = models.CharField(
        max_length=50,
        blank=False,
        null=False
    )
    address = models.CharField(
        max_length=50,
        blank=False,
        null=False
    )
    dni = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )
    shipping_method = models.ForeignKey(
        ShippingMethod,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    status = models.CharField(
        max_length=20,
        choices=ORDER_STATUS,
        default="TO BE CONFIRMED"
    )
    total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )
    total_with_shipping = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENTS,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def base_price(self):
        return f'${self.total}'

    def total_price(self):
        return f'${self.total_with_shipping}'

    def shipping_Method(self):
        return f"{self.shipping_method.name} (${self.shipping_method.get_price()})"

    def order_status(self):
        if self.status == "TO BE CONFIRMED":
            return format_html(
                '<span style="background-color:#EB6300; color: #fff; padding:7px;">{}</span>',
                self.status,
            )
        elif self.status == "NOT ACCREDITED":
            return format_html(
                '<span style="background-color:#F00; color: #fff; padding:7px;">{}</span>',
                self.status,
            )
        elif self.status == "ACCREDITED":
            return format_html(
                '<span style="background-color:#0f0; color: #000; padding:7px;">{}</span>',
                self.status,
            )
        elif self.status == "BILLED":
            return format_html(
                '<span style="background-color:#00f; color: #fff; padding:7px;">{}</span>',
                self.status,
            )
        elif self.status == "DISPATCHED":
            return format_html(
                '<span style="background-color:#ccc; color: #444; padding:7px;">{}</span>',
                self.status,
            )


class Item(models.Model):
    order = models.ForeignKey(
        Order,
        related_name='items',
        on_delete=models.CASCADE
    )
    each_product = models.ForeignKey(
        Product,
        related_name='order_items',
        on_delete=models.CASCADE
    )
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        verbose_name = "Item"
        verbose_name_plural = "Items"

    def __str__(self):
        return str(self.id)

    def single_price(self):
        return f'${self.price}'
