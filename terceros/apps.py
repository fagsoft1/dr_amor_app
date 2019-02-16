from django.apps import AppConfig


class TercerosConfig(AppConfig):
    name = 'terceros'

    def ready(self):
        import terceros.signals
