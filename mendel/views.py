from django.conf import settings
from django.shortcuts import render

# Create your views here.
def index(request):
    context = {'DEBUG': settings.DEBUG}
    return render(request, 'index.html', context)
