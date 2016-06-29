from django.conf.urls import include, url
from django.views.generic import RedirectView

from django.contrib import admin
admin.autodiscover()

import mendel.views
from mendel.api_views import KeywordViewSet, CategoryViewSet, ContextViewSet, DocumentViewSet, ReviewViewSet, UserViewSet

from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'keywords', KeywordViewSet)
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
