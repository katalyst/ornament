Ornament
========

Ornament is a pattern/component library and a boilerplate template for kick-starting development for a ruby on rails project.

Visit the [Ornament website](http://ornament.katalyst.com.au/) for more information.

Dependancies
------------

* RailsUJS
* React (optional)

Installation
------------

1.  Add to your `Gemfile`:  

    ```ruby
    group :development do
      gem 'ornament', github: 'katalyst/ornament'
    end
    ```

1.  Run bundler:  

    ```bash
    bundle install
    ```

1.  Run the generator:  

    ```bash
    rails generate ornament
    ```

1. Make sure these gems were added to your gemfile:

    ```bash
    gem  'sass-rails',    '~> 5.0.0'
    gem  'uglifier',      '>= 1.0.3'
    gem  'htmlentities',  '~> 4.3.4'
    ```

License
-------

Copyright (c) 2013 Katalyst Interactive.

See the LICENSE file for details.

