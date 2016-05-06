# Mendel

Mendel is a tool for tagging keywords from sets of data.

We get keywords inputted, we read where the keyword came from and what it is, and we assign tags to it. Simple.


This application supports the [Getting Started with Python on Heroku](https://devcenter.heroku.com/articles/getting-started-with-python) article - check it out.

## Running Locally

Make sure you have Python [installed properly](http://install.python-guide.org).  Also, install the [Heroku Toolbelt](https://toolbelt.heroku.com/) and [Postgres](https://devcenter.heroku.com/articles/heroku-postgresql#local-setup).

```sh
$ git clone git@github.com:Architizer/Mendel.git
$ cd Mendel

$ pip install -r requirements.txt

$ createdb mendel

$ python manage.py migrate
$ python manage.py collectstatic
$ python manage.py createsuperuser

$ heroku local
```

Mendel should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```sh
$ heroku create
$ git push heroku master

$ heroku run python manage.py migrate
$ heroku open
```
or

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## References

- [Python on Heroku](https://devcenter.heroku.com/categories/python)
- [Postgres.app](http://postgresapp.com/)
- [Using Command Line Tools with Postgres.app](http://postgresapp.com/documentation/cli-tools.html)
