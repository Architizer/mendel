from __future__ import unicode_literals

from django.db import models


class Tag(models.Model):

    def __unicode__(self):
        return self.name

    name = models.CharField(max_length=200, unique=True)


class Keyword(models.Model):

    def __unicode__(self):
        return self.name + u' [' + self.tag_list + u']'

    name = models.CharField(max_length=200, unique=True)
    is_stopword = models.BooleanField(default=False)
    tags = models.ManyToManyField(Tag)
    frequency = models.IntegerField(null=True)

    @property
    def tag_list(self):
        return u'; '.join([tag['name'] for tag in self.tags.values()])