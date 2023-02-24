def account(request):
    search = not request.path.startswith('/account/')
    search = search or 'dashboard' in request.path
    return {
        'search': search
    }
