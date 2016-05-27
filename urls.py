from django.conf.urls import include, url
from django.views.generic import RedirectView

from django.contrib import admin
admin.autodiscover()

import mendel.views
from mendel.models import Keyword, Category, Document, Context, Review
from django.contrib.auth.models import User

from rest_framework import permissions, routers, serializers, viewsets


class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ('id', 'name')

class KeyViewSet(viewsets.ModelViewSet):
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer
    permission_classes = (permissions.IsAuthenticated,)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (permissions.IsAuthenticated,)

class ContextSerializer(serializers.ModelSerializer):
    keyword = KeywordSerializer()

    class Meta:
        model = Context
        fields = ('id', 'position_from', 'position_to', 'text', 'document', 'keyword')
        depth = 1

class ContextViewSet(viewsets.ModelViewSet):
    queryset = Context.objects.all()
    serializer_class = ContextSerializer
    permission_classes = (permissions.IsAuthenticated,)

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ('__all__')

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = (permissions.IsAuthenticated,)

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('__all__')

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = (permissions.IsAuthenticated,)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'is_staff')

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)


router = routers.DefaultRouter()
router.register(r'keywords', KeyViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'context', ContextViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^admin', RedirectView.as_view(url='/admin/')),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include('rest_framework.urls')),
    url(r'^api$', RedirectView.as_view(url='/api/v1/')),
    url(r'^.*$', mendel.views.index, name='index'),
]
