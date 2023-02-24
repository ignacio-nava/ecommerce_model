import csv
from pathlib import Path

from account.models import UserBase
from store.models import Category, Product


BASE_DIR = Path(__file__).resolve().parent

def normailize_price(price_str):
    price_list = [
        float(n)
        for m in price_str[1:].split(',')
        for n in m.split('.')
    ]
    if len(price_list) > 1:
        price = sum(price_list[:-1]) + price_list[-1] / 100
    else:
        price = price_list[0]
    return round(price, 2)

def run(*args):
    file_path = BASE_DIR / 'data' / args[0]
    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        reader.__next__()
        for row in reader:
            cat_name = ' '.join(row[1].split('-'))
            category, _ = Category.objects.get_or_create(name=cat_name, slug=row[1])
            user = UserBase.objects.get(pk=1)
            title = row[2]
            price = normailize_price(row[4])
            product = Product(
                category=category,
                created_by=user,
                title=title,
                image_external=row[3],
                price=price
            )
            product.save()
