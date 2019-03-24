from django.apps import AppConfig


class InventariosConfig(AppConfig):
    name = 'inventarios'

    def ready(self):
        import inventarios.signals
