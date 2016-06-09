from django.conf.urls import include, url
from django.views.generic import RedirectView

from django.contrib import admin
admin.autodiscover()

import mendel.views
from mendel.models import Keyword, Category, Document, Context, Review
from django.contrib.auth.models import User
from rest_auth.models import TokenModel
from rest_framework import permissions, routers, serializers, viewsets


class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ('id', 'name', 'definition')

class KeyViewSet(viewsets.ModelViewSet):
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer
    permission_classes = (permissions.IsAuthenticated,)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'description')

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (permissions.IsAuthenticated,)

class ContextSerializer(serializers.ModelSerializer):
    keyword = KeywordSerializer()

    class Meta:
        model = Context
        fields = ('id', 'position_from', 'position_to', 'text', 'document', 'keyword', 'next_context_id', 'prev_context_id', 'reviews')
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
    last_context_id = serializers.SerializerMethodField('return_last_context_id')

    def return_last_context_id(self, user):
        try:
            return Review.objects.filter(user=user.id).latest('created').context.id
        except:
            return Context.objects.first().id


    class Meta:
        model = User
        fields = ('id', 'username', 'is_staff', 'last_context_id')

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)

# Django Rest Auth Token Serializer
class TokenSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = TokenModel
        fields = ('key','user',)
        depth = 1

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
    url(r'^api$', RedirectView.as_view(url='/api/v1/')),
    url(r'^api/v1/', include('rest_auth.urls')),
    url(r'^.*$', mendel.views.index, name='index'),
]
