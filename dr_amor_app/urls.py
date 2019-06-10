from django.conf.urls import url, include
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .api_urls import router
from index.views import IndexView
from knox.views import LogoutView

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^chat/', include('chat.urls')),
    path('api/auth/logout', LogoutView.as_view()),
    path('api/', include(router.urls)),
    url(r'^app/*', IndexView.as_view()),
    path('', include('index.urls')),
]

if settings.DEBUG:
    urlpatterns = [
                      url(r'^silk/', include('silk.urls', namespace='silk')),
                  ] + urlpatterns
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
