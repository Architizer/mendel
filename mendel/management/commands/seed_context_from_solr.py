import pysolr

from django.core.management.base import BaseCommand, CommandError

from settings import WEBSOLR_URL
from mendel.models import Context, Document, Keyword


class Command(BaseCommand):
    help = 'seed Context model using SOLR'

    def handle(self, *args, **options):
        solr = pysolr.Solr(WEBSOLR_URL, timeout=10)

        for keyword in Keyword.objects.all():
            hits = solr.search('text:"%s"' % keyword.name).hits
            if hits > 0:
                results = solr.search('text:"%s"' % keyword.name, **{
                    'rows': hits,
                    'hl': 'true',
                    'hl.fl': 'text',
                    'hl.simple.pre': '',
                    'hl.simple.post': ''
                })
                docs = results.docs
                highlighting = results.highlighting

                for doc in docs:
                    doc_id = doc['id']
                    doc_text = doc['text']

                    if doc['django_ct'] == 'architizer.productrequest':
                        doc_type = "S"
                    if doc['django_ct'] == 'architizer.productresponse':
                        doc_type = "R"

                    document = Document.objects.get(of_type=doc_type,
                                                    architizer_id=doc['object_id'])

                    text = highlighting[doc_id]['text'][0]
                    position_from = doc_text.index(text)
                    position_to = position_from + len(text)

                    if Context.objects.filter(document=document, text=text, keyword_given=keyword).count() == 0:
                        Context.objects.create(
                            document=document,
                            keyword_given=keyword,
                            position_from=position_from,
                            position_to=position_to,
                            text=text
                        )
