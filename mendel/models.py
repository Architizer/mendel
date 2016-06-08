from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User



class Keyword(models.Model):
    name = models.CharField(max_length=200, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=200, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "categories"

    def __unicode__(self):
        return self.name

class Document(models.Model):

    PRODUCT_SEARCH = "S"
    PRODUCT_RESPONSE = "R"

    DOCUMENT_TYPES = (
        (PRODUCT_SEARCH, "Product Search"),
        (PRODUCT_RESPONSE, "Product Response"),
    )

    of_type = models.CharField(max_length=10, choices=DOCUMENT_TYPES)
    architizer_id = models.IntegerField(null=True)
    title = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.title

class Context(models.Model):
    document = models.ForeignKey(Document)
    keyword = models.ForeignKey(Keyword)
    position_from = models.IntegerField()
    position_to = models.IntegerField()
    text = models.TextField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.text

    def next_context_id(self):
        try:
            return(Context.objects.get(id=self.id+1).id)
        except:
            return None

    def prev_context_id(self):
        try:
            return(Context.objects.get(id=self.id-1).id)
        except:
            return None


class Review(models.Model):

    PENDING = "pending"
    APPROVED = "approved"

    STATUS_TYPES = (
        ("pending", PENDING),
        ("approved", APPROVED),
    )

    context = models.ForeignKey(Context, related_name="reviews")
    keyword = models.ForeignKey(Keyword)
    category = models.ForeignKey(Category)
    user = models.ForeignKey(User)
    status = models.CharField(max_length=20, choices=STATUS_TYPES, default=PENDING)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('context', 'keyword', 'category', 'user', 'status')

    def __unicode__(self):
        return self.status
