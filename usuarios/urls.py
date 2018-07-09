from django.urls import path

from usuarios.api_views import UserAPI, LoginAPI
from knox.views import LogoutView, LogoutAllView

urlpatterns = [
    path('user/', UserAPI.as_view()),
    path('login/', LoginAPI.as_view()),
    path('logout/', LogoutView.as_view()),
    path('logoutall/', LogoutAllView.as_view()),
]
