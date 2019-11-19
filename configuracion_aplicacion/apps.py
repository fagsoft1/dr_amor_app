from django.apps import AppConfig


class ConfiguracionAplicacionConfig(AppConfig):
    name = 'configuracion_aplicacion'

    def ready(self):
        import configuracion_aplicacion.signals
