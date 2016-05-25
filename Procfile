web: cd mendel/angular/ && gulp clean && gulp django; cd ../../ && python manage.py collectstatic --no-input --clear; gunicorn wsgi --reload --log-level DEBUG --log-file -
