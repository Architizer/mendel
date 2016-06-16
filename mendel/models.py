from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from wordnik import *
import settings


class Keyword(models.Model):
    name = models.CharField(max_length=200, unique=True) #case sensitivie
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.name

    def clean(self):
        self.name = self.name.capitalize()

    def save(self, *args, **kwargs):
            self.full_clean()
            return super(Keyword, self).save(*args, **kwargs)

    def definition(self):
        try:
            client = swagger.ApiClient(settings.WORDNIK_API_KEY, settings.WORDNIK_API_URL)
            wordApi = WordApi.WordApi(client)
            return wordApi.getDefinitions(self.name)[0].text
        except:
            return None


class Category(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True, null=True)
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

    of_type = models.CharField(max_length=10, choices=DOCUMENT_TYPES, verbose_name="Type")
    architizer_id = models.IntegerField(null=True, verbose_name="Architizer ID")
    title = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.title

class Context(models.Model):
    document = models.ForeignKey(Document)
    keyword_given = models.ForeignKey(Keyword)
    position_from = models.IntegerField()
    position_to = models.IntegerField()
    text = models.TextField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    # post to context with an array of categories maybe keyword...
    #create review objects that do not exist (if there is a category in the array)
    #delete Review objects that do not happen ( )

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
    keyword_proposed = models.ForeignKey(Keyword, related_name="keyword_proposed")
    keyword_given = models.ForeignKey(Keyword, related_name="keyword_given")
    category = models.ForeignKey(Category)
    user = models.ForeignKey(User)
    status = models.CharField(max_length=20, choices=STATUS_TYPES, default=PENDING)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)


    class Meta:
        unique_together = ('context', 'keyword_proposed', 'category', 'user', 'status')

    def __unicode__(self):
        return self.status

    # def save(self):
    #     #get keyword given from database
    #     if self.keyword_proposed:
    #         exists: 
    #         if Keyword.objects.filter(name=self.keyword_proposed).exists()

