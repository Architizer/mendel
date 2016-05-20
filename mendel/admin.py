from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from mendel.models import Keyword, Category, Document, Context, Review


class KeywordAdmin(ImportExportModelAdmin):
    list_display = ('id', 'name')
    pass


class CategoryAdmin(ImportExportModelAdmin):
    list_display = ('id', 'name')
    pass


class DocumentAdmin(ImportExportModelAdmin):
    list_display = ('id', 'title', 'description')
    pass


class ContextAdmin(ImportExportModelAdmin):
    list_display = ('keyword', 'text', 'document')
    pass


class ReviewAdmin(ImportExportModelAdmin):
    list_display = ('keyword', 'category', 'user', 'status')
    pass


admin.site.register(Keyword, KeywordAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Document, DocumentAdmin)
admin.site.register(Context, ContextAdmin)
admin.site.register(Review, ReviewAdmin)