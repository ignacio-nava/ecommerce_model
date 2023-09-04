from django import template

register = template.Library()


@register.filter
def quantity_range(value):
    value = 4 if value < 4 else value
    return range(1, value+1)
