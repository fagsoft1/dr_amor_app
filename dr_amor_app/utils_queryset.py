import operator
from functools import reduce
from django.db import models


def query_varios_campos_or(queryset, search_fields, parametro):
    def construct_search(field_name):
        if field_name.startswith('^'):
            return "%s__istartswith" % field_name[1:]
        elif field_name.startswith('='):
            return "%s__iexact" % field_name[1:]
        elif field_name.startswith('@'):
            return "%s__search" % field_name[1:]
        else:
            return "%s__icontains" % field_name

    orm_lookups = [construct_search(str(search_field))
                   for search_field in search_fields]
    for bit in parametro.split():
        or_queries = [models.Q(**{orm_lookup: bit})
                      for orm_lookup in orm_lookups]
        queryset = queryset.filter(reduce(operator.or_, or_queries))
    return queryset