Ornament
========

A production-ready, browser-friendly front-end framework for your Rails app.

Visit the [Ornament website](http://ornament.katalyst.com.au/) for more information.

Installation
------------

1.  Add to your `Gemfile`:  

    ```ruby
    gem 'sass-rails', '~> 5.0.6'
    gem 'uglifier', '~> 3.0.4'
    gem 'compass-rails', '~> 3.0.2'
    gem 'htmlentities', '~> 4.3.4'

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

1. Update `config/initializers/assets.rb`:  

    ```ruby
    Rails.application.config.assets.precompile += %w( application_split2.css  selectivizr.js respond.js application_bottom.js styleguide.css styleguide_split2.css styleguide.js )
    ```

License
-------

Copyright (c) 2013 Katalyst Interactive.

See the LICENSE file for details.

Acknowledgments
---------------

The project uses [IE9.js](http://code.google.com/p/ie7-js/) - copyright 2004-2010, Dean Edwards.
