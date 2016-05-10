from django.contrib import admin

# Register your models here.

from mendel.models import Keyword, Category, Document, Content, Review


admin.site.register(Keyword)
admin.site.register(Category)
admin.site.register(Document)
admin.site.register(Content)
admin.site.register(Review)




