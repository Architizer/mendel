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

Next, run our setup script:

```sh
$ ./bin/setup_local
```
(A super user is automatically created with the username **admin** and the password **architizer**)

Finally, start the development API server:

```sh
$ heroku local
```

On Windows:

```sh
$ heroku local -f Procfile.windows
```

The Mendel API should now be running on <http://localhost:5000/api/>.

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

**Use the Deploy button:**

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Or, run the commands by hand:

```sh
# 1. Run our Heroku setup script
$ ./bin/heroku_create

# 2. Push repo to Heroku
$ git push heroku master

# 3. Create an initial admin user
$ heroku run python manage.py createsuperuser

# 4. Open the app in a browser
$ heroku open
```

## References

- [Python on Heroku](https://devcenter.heroku.com/categories/python)
- [Getting Started with Python on Heroku](https://devcenter.heroku.com/articles/getting-started-with-python)
- [Postgres.app](http://postgresapp.com/)
- [Using Command Line Tools with Postgres.app](http://postgresapp.com/documentation/cli-tools.html)