from django.conf.urls import include, url
from django.views.generic import RedirectView

from django.contrib import admin
admin.autodiscover()

import mendel.views
from mendel.models import Keyword, Category, Document, Context, Review
from django.contrib.auth.models import User

from rest_framework import routers, serializers, viewsets


class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ('id', 'name')

class KeyViewSet(viewsets.ModelViewSet):
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ContextSerializer(serializers.ModelSerializer):
    keyword = KeywordSerializer()

    class Meta:
        model = Context
        fields = ('id', 'position_from', 'position_to', 'text', 'document', 'keyword')
        depth = 1

class ContextViewSet(viewsets.ModelViewSet):
    queryset = Context.objects.all()
    serializer_class = ContextSerializer

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ('__all__')

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('__all__')

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'is_staff')

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


router = routers.DefaultRouter()
router.register(r'keywords', KeyViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'context', ContextViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    url(r'^$', mendel.views.index, name='index'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^api/', include(router.urls)),
    # TODO: Re-enable versioning of the API
    # url(r'^api/v1/', include(router.urls)),
    # url(r'^api/', RedirectView.as_view(url='/api/v1/')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
