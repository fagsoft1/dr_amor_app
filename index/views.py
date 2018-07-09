from django.views.generic import TemplateView

from braces.views import LoginRequiredMixin


class IndexView(TemplateView):
    template_name = 'index.html'
