import re

from django import forms

from .models import Order, ShippingMethod

STATES_CHOICES = [('', '---------')] + Order.STATES


class ShippingMethodModelChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return {
            'obj': obj
        }


class OrderForm(forms.ModelForm):
    first_name = forms.CharField(required=True)
    last_name = forms.CharField(required=True)
    state = forms.ChoiceField(
        choices=STATES_CHOICES,
        required=True
    )
    city = forms.CharField(required=True)
    address = forms.CharField(required=True)
    dni = forms.CharField(required=True)
    shipping_method = ShippingMethodModelChoiceField(
        queryset=ShippingMethod.objects.all(),
        required=True
    )

    class Meta:
        model = Order
        fields = (
            'first_name',
            'last_name',
            'state',
            'city',
            'address',
            'dni',
            'shipping_method',
        )

    def clean_dni(self):
        dni = self.cleaned_data['dni']

        bugs = re.search('[^0-9\.]', dni)
        if bugs:
            raise forms.ValidationError('DNI not valid.')

        dni = ''.join(filter(str.isdigit, dni))
        if len(dni) < 7 or len(dni) > 8:
            raise forms.ValidationError('DNI not valid.')

        return dni


PAYMENTS_CHOICES = [('', '---------')] + Order.PAYMENTS


class PayMentMethodForm(forms.ModelForm):
    payment_method = forms.ChoiceField(
        choices=PAYMENTS_CHOICES,
        required=True
    )

    class Meta:
        model = Order
        fields = (
            'payment_method',
        )
