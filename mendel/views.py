from django.conf import settings
from django.shortcuts import render
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from models import Context, Review, Keyword, Category


def index(request):
    context = {'DEBUG': settings.DEBUG}
    return render(request, 'index.html', context)

 
class PostContext(APIView):

    def post(self, request, id):
        context = Context.objects.get(id=id)
        counter = 0
        keyword_proposed = context.keyword_given

        if request.data.get('keyword_proposed'):
            keyword_proposed, created = Keyword.objects.get_or_create(
                name=request.data.get('keyword_proposed')['name']
            )

        existing_review_count = Review.objects.filter(context=context).count()
        if not existing_review_count:
            for category in request.data.get('categories'):
                Review.objects.create(
                    context=context, 
                    category=Category.objects.get(id=category), 
                    keyword_given=context.keyword_given, 
                    keyword_proposed=keyword_proposed,
                    user=request.user,
                    status=Review.PENDING)
                counter += 1

        return Response({
            "keyword_created": created, 
            "keyword_proposed": keyword_proposed.name, 
            "reviews_created": counter, 
            "existing_review_count": existing_review_count
            })

