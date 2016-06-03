import pysolr

from django.core.management.base import BaseCommand, CommandError

from settings import SOLR_DOCUMENTS_URL
from mendel.models import Context, Document, Keyword


class Command(BaseCommand):
    help = 'seed Context model using SOLR'

    def handle(self, *args, **options):
        solr = pysolr.Solr(SOLR_DOCUMENTS_URL, timeout=10)

        for keyword in Keyword.objects.all():
            # re
