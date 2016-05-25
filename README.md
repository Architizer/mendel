# Mendel

Mendel is a tool for tagging keywords from sets of data.

## Running Locally

### Prerequisites

Install the following:

- [Python](http://install.python-guide.org)
- [NodeJS](https://nodejs.org/en/download/)
- [Heroku Toolbelt](https://toolbelt.heroku.com/)
- [Postgres](https://devcenter.heroku.com/articles/heroku-postgresql#local-setup) ([Postgres.app](http://postgresapp.com) recommended, don't forget to set up the [command line tools](http://postgresapp.com/documentation/cli-tools.html))

### API

First, clone the repository:

```sh
$ git clone git@github.com:Architizer/mendel.git
$ cd mendel
```

Next, run our setup script and create a super user:

```sh
$ ./bin/setup_local
$ python manage.py createsuperuser
```

Finally, start the development API server:

```sh
$ heroku local
```

The Mendel API should now be running on [http://localhost:5000/api/](http://localhost:5000/api/).

### Front End

The front end is generated from the [gulp-angular](https://github.com/Swiip/generator-gulp-angular) generator for [Yeoman](http://yeoman.io/).

To work on the front end in development, run the following:

```sh
$ cd mendel/angular
$ gulp serve
```

This will open the front end app in a browser using [BrowserSync](https://www.browsersync.io/), which will live-reload when changes are made inside the `mendel/angular` directory. 

**Note:** you will need the API running locally to serve data to the front end. Keep `heroku local` running in a separate terminal window.


## Deploying to Heroku

To deploy to a new Heroku instance, run the following:

```sh
$ ./bin/heroku_create
$ git push heroku master
```

To create an initial admin user, run the following:

```sh
$ heroku run python manage.py createsuperuser
```

Finally, to open your new Heroku app in a browser, run the following:

```sh
$ heroku open
```

## References

- [Python on Heroku](https://devcenter.heroku.com/categories/python)
- [Getting Started with Python on Heroku](https://devcenter.heroku.com/articles/getting-started-with-python)
- [Postgres.app](http://postgresapp.com/)
- [Using Command Line Tools with Postgres.app](http://postgresapp.com/documentation/cli-tools.html)