from django.shortcuts import render
from django.utils.safestring import mark_safe
import json

from django.views.generic import TemplateView

from braces.views import LoginRequiredMixin


class IndexView(LoginRequiredMixin, TemplateView):
    template_name = 'index.html'

def room(request, room_name):
    return render(request, 'room.html', {
        'room_name_json': mark_safe(json.dumps(room_name))
    })