from django import template
from num2words import num2words

register = template.Library()


@register.simple_tag
def number_to_word(number):
    """
    Returns verbose_name for a field.
    """
    return num2words(number, lang='es_CO', to='currency').upper()
