from django.contrib.auth.models import User
from django.test import TestCase

from ..factories import UserFactory

from faker import Faker

faker = Faker()


class UserTests(TestCase):
    def test_user_login(self):
        count = User.objects.count()
        UserFactory()
        self.assertEqual(count + 1, User.objects.count())
