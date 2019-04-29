from .base import *
import sys

try:
    with open("secretsLocal.json") as f:
        from .local import *
except:
    from .production import *

if 'test' in sys.argv or 'test_coverage' in sys.argv:
    from .test import *
