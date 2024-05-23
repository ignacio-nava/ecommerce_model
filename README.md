# Ecommerce Model

It's a study project. I'm trying to employ as many technologies as possible. I choose an e-commerce template site. In the front, I'm working with JQuery and JavaScript vanilla (making my carousel module). In the backend, I'm using Django.

## Deployment

To deploy this project follow this steps:

#### 1)
Clone the repository 
```bash
  git clone https://github.com/ignacio-nava/ecommerce_model.git
  cd ecommerce_model
```

#### 2)

Create and activate the virtual enviroment

#### 3)

Run
```bash
  pip install -r requirements.txt
  python manage.py makemigrations
  python manage.py migrate
  python manage.py createsuperuser
  python manage.py runscript load_products
  python manage.py runscript load_shipping_methods
  python manage.py runserver  
```
