import factory
from django.contrib.auth.models import User
from django.utils import timezone
from faker import Faker

faker = Faker()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: 'usuario%d' % n)
    first_name = factory.Sequence(lambda n: 'usuario%d' % n)
    last_name = factory.Sequence(lambda n: 'usuario%d' % n)
    password = factory.Sequence(lambda n: 'usuario%d' % n)
    email = factory.Sequence(lambda n: 'usuario%d@cosa.com' % n)
    is_staff = False
    is_active = True
    is_superuser = False
    date_joined = timezone.now()
