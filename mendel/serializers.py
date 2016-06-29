from .models import Keyword, Category, Document, Context, Review, User

from rest_auth.models import TokenModel
from rest_framework import serializers


# Keyword
class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ('id', 'name', 'definition')

    def create(self, validated_data):
        instance, _ = Keyword.objects.get_or_create(**validated_data)
        return instance

# Category
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'description')

# Context
class ContextSerializer(serializers.ModelSerializer):
    keyword_given = KeywordSerializer()

    class Meta:
        model = Context
        fields = ('id', 'position_from', 'position_to', 'text', 'document', 'keyword_given', 'next_context_id', 'prev_context_id', 'reviews')
        depth = 1

    # return the object
    # def reviews(self, user):
    #     try:
    #         return Review.objects.filter(user=request.user.id)
    #     except:
    #         return None

# Document
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ('__all__')

# Review
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('__all__')

# User
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

# Token (Django REST Auth)
class TokenSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = TokenModel
        fields = ('key','user',)
        depth = 1
