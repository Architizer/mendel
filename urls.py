from django.conf.urls import include, url

from django.contrib import admin
admin.autodiscover()

import mendel.views
from mendel.models import Keyword, Category, Document, Content, Review

from rest_framework import routers, serializers, viewsets


class KeywordSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Keyword
        fields = ('__all__')


class KeyViewSet(viewsets.ModelViewSet):
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ('__all__')


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ContentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Content
        fields = ('__all__')
        

class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer


class DocumentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Document
        fields = ('__all__')
        

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer


class ReviewSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Review
        fields = ('__all__')
        

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

router = routers.DefaultRouter()
router.register(r'keywords', KeyViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'content', ContentViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    url(r'^$', mendel.views.index, name='index'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
