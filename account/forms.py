from django import forms
from django.contrib.auth.forms import (
    AuthenticationForm,
    PasswordResetForm,
    SetPasswordForm
)

from .models import UserBase


class UserLoginForm(AuthenticationForm):
    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control mb-3',
                'placeholder': 'Username',
                'id': 'login-username'
            }
        )
    )
    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Password',
                'id': 'login-pwd',
            }
        )
    )


class RegistrationForm(forms.ModelForm):
    user_name = forms.CharField(
        label='Enter Username',
        min_length=4,
        max_length=50,
        help_text='Required'
    )
    email = forms.EmailField(
        max_length=100,
        help_text='Required',
        error_messages={'required': 'Sorry, you will need an email'}
    )
    password = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Repeat password', widget=forms.PasswordInput)

    class Meta:
        model = UserBase
        fields = ('user_name', 'email',)

    def clean_user_name(self):
        user_name = self.cleaned_data['user_name'].lower()
        r = UserBase.objects.filter(user_name=user_name)
        if r.count():
            raise forms.ValidationError("Username already exists")
        return user_name

    def clean_email(self):
        email = self.cleaned_data['email']
        if UserBase.objects.filter(email=email).exists():
            raise forms.ValidationError('Please use another Email, that is already taken')
        return email

    def clean_password2(self):
        cd = self.cleaned_data
        if cd['password'] != cd['password2']:
            raise forms.ValidationError('Passwords do not match.')
        return cd['password2']

class UserEditForm(forms.ModelForm):
    email = forms.EmailField(
        label='Account email (can not be changed)',
        max_length=200,
        widget=forms.TextInput(
            attrs={
                #'class': 'form-control mb-3',
                #'placeholder': 'email',
                #'id': 'form-email',
                'readonly': 'readonly'
            }
        )
    )
    user_name = forms.CharField(
        label='Firstname',
        min_length=4,
        max_length=50,
        widget=forms.TextInput(
            attrs={
                'readonly': 'readonly'
            }
        )
    )
    first_name = forms.CharField(
        label='Username',
        min_length=4,
        max_length=50,
        widget=forms.TextInput(
            attrs={}
        )
    )

    class Meta:
        model = UserBase
        fields = ('email', 'user_name', 'first_name',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['user_name'].required = True
        self.fields['email'].required = True


class PwResetForm(PasswordResetForm):
    email = forms.EmailField(
        max_length=254,
        widget=forms.TextInput(
            attrs={}
        )
    )

class PwdResetConfirmForm(SetPasswordForm):
    new_password1 = forms.CharField(
        label='New password',
        widget=forms.PasswordInput(
            attrs={}
        )
    )
    new_password2 = forms.CharField(
        label='Repeat password',
        widget=forms.PasswordInput(
            attrs={}
        )
    )
