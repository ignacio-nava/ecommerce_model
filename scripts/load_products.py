import csv
from pathlib import Path

from django.db.utils import IntegrityError

from account.models import UserBase
from store.models import Category, Product


BASE_DIR = Path(__file__).resolve().parent

def set_vars(*args):
    '''
    This function sets the required  variables
    Defualt:
        path_folder=data
        output=products.csv
    '''
    vars = {
        'path_folder': 'data',
        'output': 'products.csv'
    }
    for arg in args:
        key, value = arg.split('=')
        vars[key] = value

    return vars
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

def create_product(fields):
    product = Product(**fields)
    try:
        product.save()
    except IntegrityError:
        return False
    return True

def log_status(new_categories, new_products, end='\r', rejects=[], final=False):
    print(f'Loading data... CATEGORIES {new_categories:2} | PRODUCTS {new_products:4}', end=end)

    if final:
        print(f'\033[1mTotal Categories en DB: {Category.objects.all().count()}')
        print(f'Total Products en DB: {Product.objects.all().count()}\033[0m')
        rejects_count = len(rejects)
        if rejects_count > 0:
            print(f' Rows Rejected {rejects_count} '.center(50, '·'))
            for row in rejects:
                print(f'\t- [{row[0]}]')
            print(''.center(50, '·'))

def run(*args):
    vars = set_vars(*args)
    file_path = BASE_DIR / vars['path_folder'] / vars['output']

    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        reader.__next__()

        new_categories, new_products = 0, 0
        rows_rejected = []
        for row in reader:
            log_status(new_categories, new_products)
            category_name = row[1]
            category_slug = '-'.join(category_name.lower().replace(',','').split(' '))

            category, is_new = Category.objects.get_or_create(
                name=category_name,
                slug=category_slug
            )
            if is_new:
                new_categories += 1
                log_status(new_categories, new_products)

            fields = {
                'category': category,
                'created_by': UserBase.objects.get(pk=1),
                'title': row[2],
                'image_external': row[3],
                'price': normailize_price(row[4])
            }

            product_was_saved = create_product(fields)
            if not product_was_saved:
                rows_rejected.append(row)
                continue
            new_products += 1
            log_status(new_categories, new_products)

        log_status(
            new_categories,
            new_products,
            end=f' \033[1;32m[OK!]\033[0m\n',
            rejects=rows_rejected,
            final=True
        )
