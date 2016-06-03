from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from mendel.models import Keyword, Category, Document, Context, Review


class KeywordAdmin(ImportExportModelAdmin):
    search_fields = ['name']
    list_display = ('id', 'name', 'created', 'modified')
    pass


class CategoryAdmin(ImportExportModelAdmin):
    list_display = ('id', 'name', 'created', 'modified')
    pass


class DocumentAdmin(ImportExportModelAdmin):
    list_display = ('id', 'title', 'description', 'created', 'modified')
    pass


class ContextAdmin(ImportExportModelAdmin):
    list_display = ('keyword', 'text', 'document', 'created', 'modified')
    pass


class ReviewAdmin(ImportExportModelAdmin):
    list_display = ('keyword', 'category', 'user', 'status', 'created', 'modified')
    pass


admin.site.register(Keyword, KeywordAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Document, DocumentAdmin)
admin.site.register(Context, ContextAdmin)
admin.site.register(Review, ReviewAdmin)
