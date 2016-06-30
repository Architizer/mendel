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
    search_fields = ['title', 'description']
    list_display = ('id', 'title', 'description', 'created', 'modified')
    pass


class ContextAdmin(ImportExportModelAdmin):
    list_display = ('keyword_given', 'text', 'document', 'created', 'modified')
    pass


class ReviewAdmin(ImportExportModelAdmin):
    list_display = ('id', 'keyword_given', 'keyword_proposed', 'category', 'get_context_id', 'user', 'status', 'created', 'modified')

    def get_context_id(self, obj):
        return obj.context.id
    get_context_id.admin_order_field = 'id'
    get_context_id.short_description = 'Context ID'

    pass


admin.site.register(Keyword, KeywordAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Document, DocumentAdmin)
admin.site.register(Context, ContextAdmin)
admin.site.register(Review, ReviewAdmin)
