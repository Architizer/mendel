#!/usr/bin/env python
import os
import sys

print sys.path

if __name__ == "__main__":
    print sys.path

    if os.path.dirname(__file__) == "/home/ubuntu/mendel":
        os.chdir('..')  # added so CircleCI can find the tests
    
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
