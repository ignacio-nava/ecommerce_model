from typing import Any, Dict
from django import http
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.views import LoginView, PasswordResetView
from django.template.loader import render_to_string
from django.urls import reverse_lazy
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib import messages

from .models import UserBase
from .forms import (
    RegistrationForm,
    UserLoginForm,
    UserEditForm,
    PwResetForm
)
from .tokens import account_activation_token

BACK_TO_SITE = {
    "innerHTML": "Back to site",
    "url": reverse_lazy('store:product_all'),
    "class": "bold"
}


class OwnPasswordResetView(PasswordResetView):
    template_name = 'account/registration/form.html'
    success_url = 'password_reset_email_confirm'
    email_template_name = 'account/user/password_reset_email.html'
    form_class = PwResetForm
    redirect_authenticated_user = True
    extra_context = {
        'form_title': 'reset password',
        'submit_text': 'send email',
        'auth_options': [BACK_TO_SITE]
    }


class OwnLoginView(LoginView):
    template_name = 'account/registration/form.html'
    form_class = UserLoginForm
    redirect_authenticated_user = True
    extra_context = {
        'login': True,
        'form_title': 'login',
        'submit_text': 'login',
        'auth_options': [
            {
                "innerHTML": "Don't have an account yet?", "url":
                reverse_lazy('account:registration-form')
            },
            BACK_TO_SITE
        ]
    }

    def post(self, request, *args, **kwargs):
        user = authenticate(
            username=request.POST['username'],
            password=request.POST['password']
        )

        if user is not None:
            return super().post(request, *args, **kwargs)

        context = self.get_context_data()
        context['error_login_msg'] = 'The email address or password is incorrect'
        return render(request, self.template_name, context)

    def get_context_data(self, **kwargs):
        next_url = ('/').join(self.request.META['HTTP_REFERER'].split('/')[3:])
        if next_url == 'account/password_reset_complete/':
            return super().get_context_data(**kwargs)
        context = super().get_context_data()
        context['next'] = '/' + next_url
        return context


#  Replace with ListView
@login_required
def dashboard(request):
    return render(request, 'account/user/dashboard.html', {})


@login_required
def account_update(request):
    if request.method == 'POST':
        form = UserEditForm(instance=request.user, data=request.POST)

        if form.is_valid():
            form.save()
            return redirect('account:dashboard')
    else:
        form = UserEditForm(instance=request.user)

    ctx = {'form': form}
    return render(request, 'account/user/edit_details.html', ctx)


@login_required
def delete_user(request):
    if request.method == 'POST':
        user = UserBase.objects.get(user_name=request.user)
        user.is_active = False
        user.save()
        logout(request)
        return redirect('account:delete_confirmation')
    return redirect('account:dashboard')


def account_registration(request):
    auth_options = [
        {
            "innerHTML": "Already have an account?",
            "url": reverse_lazy('account:login-form')
        },
        BACK_TO_SITE
    ]

    if request.user.is_authenticated:
        return redirect('/')

    if request.method == 'POST':
        register_form = RegistrationForm(request.POST)

        if register_form.is_valid():
            user = register_form.save(commit=False)
            user.email = register_form.cleaned_data['email']
            user.set_password(register_form.cleaned_data['password'])
            user.is_active = False
            user.save()

            current_site = get_current_site(request)
            subject = 'Activate your Account'
            ctx = {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
            }
            body = render_to_string(
                'account/registration/account_activation_email.html', ctx)
            print(body)
            user.email_user(subject=subject, body=body)
            context = {
                'form_message': 'Registered succesfully and activation sent'
            }
            return render(request, 'account/registration/form.html', context)

        ctx = {
            'form': register_form,
            'form_title': "registration",
            'submit_text': "registration",
            'auth_options': auth_options
        }
        return render(request, 'account/registration/form.html', ctx)

    ctx = {
        'form': RegistrationForm(),
        'form_title': "registration",
        'submit_text': "registration",
        'auth_options': auth_options
    }
    return render(request, 'account/registration/form.html', ctx)


def account_activate(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = UserBase.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, user.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        login(request, user)
        messages.success(request, f'Welcome: {user.user_name}')
        # return redirect('account:dashboard')
        return redirect('store:product_all')
    else:
        messages.error(request, 'Invalid user verification')
        return redirect('/')
        # return render(request, 'account/registration/activation_invalid.html')
