from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.views import LoginView, PasswordResetView
from django.template.loader import render_to_string
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


class OwnPasswordResetView(PasswordResetView):
    template_name = 'account/user/password_reset_form.html'
    success_url = 'password_reset_email_confirm'
    email_template_name = 'account/user/password_reset_email.html'
    form_class = PwResetForm

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('account:dashboard')
        return super().dispatch(request, *args, **kwargs)


class OwnLoginView(LoginView):
    template_name = 'account/registration/login.html'
    form_class = UserLoginForm

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('account:dashboard')
        return super().dispatch(request, *args, **kwargs)


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
            return HttpResponse('registered succesfully and activation sent')

        ctx = {'form': register_form}
        return render(request, 'account/registration/register.html', ctx)

    ctx = {'form': RegistrationForm()}
    return render(request, 'account/registration/register.html', ctx)


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
