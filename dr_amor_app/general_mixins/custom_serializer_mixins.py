class CustomSerializerMixin(object):
    def __init__(self, instance=None, *args, **kwargs):
        context = kwargs.get('context', None)
        if context:
            campos_a_quitar = context.get('quitar_campos', None)
            if campos_a_quitar:
                existing = set(self.fields.keys())
                for field_name in campos_a_quitar:
                    if field_name in existing:
                        self.fields.pop(field_name)
        super().__init__(instance, *args, **kwargs)
