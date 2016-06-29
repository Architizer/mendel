from .models import Keyword, Category, Document, Context, Review, User
from .serializers import CategorySerializer, ContextSerializer, DocumentSerializer, KeywordSerializer, ReviewSerializer, UserSerializer, TokenSerializer

from rest_framework import permissions, serializers, viewsets


# API Views
class KeywordViewSet(viewsets.ModelViewSet):
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer
    permission_classes = (permissions.IsAuthenticated,)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (permissions.IsAuthenticated,)

class ContextViewSet(viewsets.ModelViewSet):
    queryset = Context.objects.all()
    serializer_class = ContextSerializer
    permission_classes = (permissions.IsAuthenticated,)

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = (permissions.IsAuthenticated,)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = (permissions.IsAuthenticated,)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)