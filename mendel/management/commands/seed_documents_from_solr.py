import pysolr

from django.core.management.base import BaseCommand, CommandError

from settings import SOLR_DOCUMENTS_URL
from mendel.models import Document


class Command(BaseCommand):
    help = 'seed Document model from SOLR'

    def handle(self, *args, **options):
        solr = pysolr.Solr(SOLR_DOCUMENTS_URL, timeout=10)
        doc_count = solr.search('*:*').hits
        docs = solr.search(q='*:*', rows=doc_count)

        for doc in docs:
            if doc['django_ct'] == 'architizer.productrequest':
                of_type = "S"
            if doc['django_ct'] == 'architizer.productresponse':
                of_type = "R"
            architizer_id = doc['object_id']
            title = doc['name']
            description = doc['text'] if 'text' in doc.keys() else ''

            if Document.objects.filter(of_type=of_type, architizer_id=architizer_id).count() == 0:
                Document.objects.create(
                    of_type = of_type,
                    architizer_id = architizer_id,
                    title = title,
                    description = description
                )
