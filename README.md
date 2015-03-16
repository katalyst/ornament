Ornament
========

A front-end framework for your Rails app.

Visit the [Ornament website](http://ornament.katalyst.com.au/) for more information.

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

Prototype Version
-----------------

You can use the prototype version of Ornament by changing the gemfile branch:  

```   
gem 'ornament', github: 'katalyst/ornament', branch: 'prototype'
```  

License
-------

Copyright (c) 2013 Katalyst Interactive.

See the LICENSE file for details.

Acknowledgments
---------------

The project uses [IE9.js](http://code.google.com/p/ie7-js/) - copyright 2004-2010, Dean Edwards.
