from django.conf.urls import url, include
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .api_urls import router
from index.views import IndexView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('usuarios.urls')),
    url(r'^app/*', IndexView.as_view()),
    path('', include('index.urls')),
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns = [
                      url('__debug__/', include(debug_toolbar.urls)),
                  ] + urlpatterns
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
