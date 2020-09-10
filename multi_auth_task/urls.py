from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', include('multi_auth_back.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)