from django.contrib import admin

# Register your models here.

from mendel.models import Tag, Keyword

admin.site.register(Tag)
admin.site.register(Keyword)