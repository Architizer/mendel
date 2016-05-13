from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from mendel.models import Keyword, Category, Document, Context, Review


class KeywordAdmin(ImportExportModelAdmin):
    pass


class CategoryAdmin(ImportExportModelAdmin):
    pass


class DocumentAdmin(ImportExportModelAdmin):
    pass


class ContextAdmin(ImportExportModelAdmin):
    pass


class ReviewAdmin(ImportExportModelAdmin):
    pass


admin.site.register(Keyword, KeywordAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Document, DocumentAdmin)
admin.site.register(Context, ContextAdmin)
admin.site.register(Review, ReviewAdmin)