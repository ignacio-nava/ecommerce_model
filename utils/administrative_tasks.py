import os

from django.core.management.utils import get_random_secret_key

ENVIROMENT = {
    "SECRET_KEY": 'django-insecure-' + get_random_secret_key(),
    "DEBUG": True,
    "IS_SENDING_EMAIL": False,
    "EMAIL_HOST": "",
    "EMAIL_PORT": "",
    "EMAIL_HOST_USER": "",
    "DEFAULT_FROM_EMAIL": "",
    "EMAIL_HOST_PASSWORD": "",
    "EMAIL_USE_TLS": ""
}


def create_env_file():
    print('\033[1;36mAdministrative tasks:\033[0m')
    print('  Creating environment variables... ', end='\r')

    with open('core/env.py', 'w') as file:
        for key, value in ENVIROMENT.items():
            value = str(value) if isinstance(value, bool) else f"'{value}'"
            file.write(f"{key} = {value}\n")
        file.close()

    print('  Creating environment variables... \033[1;32mOK\033[0m')
