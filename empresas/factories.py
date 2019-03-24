import factory
from .models import Empresa
from faker import Faker

faker = Faker()


class EmpresaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Empresa

    nombre = factory.Sequence(lambda n: f'{n}{faker.word()}')
    nit = factory.Sequence(lambda n: f'{n}{faker.word()}')
