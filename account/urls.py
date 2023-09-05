from django.urls import path, reverse_lazy
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView

from . import views
from .forms import PwdResetConfirmForm

app_name = 'account'
urlpatterns = [
    path('login/', views.OwnLoginView.as_view(), name='login-form'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
    path('registration/', views.account_registration,  name='registration-form'),
    path("password_reset/", views.OwnPasswordResetView.as_view(),
         name="password-reset-form"),
    path('password_reset_confirm/<uidb64>/<token>', auth_views.PasswordResetConfirmView.as_view(
        template_name='account/registration/form.html',
        success_url='/account/password_reset_complete/',
        form_class=PwdResetConfirmForm,
        extra_context={
            'form_title': 'Change your password',
            'submit_text': 'Submit'
        }
    ), name="password_reset_confirm"),
    path('password_reset/password_reset_email_confirm/', TemplateView.as_view(
        template_name="account/registration/form.html",
        extra_context={'form_message': 'Check your email for instructions'}
    ), name='password_reset_done'),
    path('password_reset_complete/', TemplateView.as_view(
        template_name="account/registration/form.html",
        extra_context={
            'form_message': 'Password Reset Success',
            'auth_options': [
                {
                    "innerHTML": "Login",
                    "url": reverse_lazy('account:login-form'),
                    "class": "bold"
                }
            ]
        }
    ), name='password_reset_complete'),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('activate/<slug:uidb64>/<slug:token>/',
         views.account_activate, name='activate'),
    # path('profile/edit/', views.account_update, name='update-form'),
    # path('profile/delete_user/', views.delete_user, name='delete_user'),
    # path('profile/delete_confirm/', TemplateView.as_view(
    #     template_name="account/user/delete_confirm.html"
    # ), name='delete_confirmation'),
]
