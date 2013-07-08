Contributing to Ornament
========================

## Working with the Dummy App

The dummy app's "app/assets" configuration includes this path:

    ../../lib/generators/ornament/templates/app/assets

The dummy app's "app/views" configuration includes this path:

    ../../lib/generators/ornament/templates/app/views

The dummy app's "vendor/assets" configuration includes this path:

    ../../lib/generators/ornament/templates/vendor/assets

This means you can modify the files in the gem and see the changes in the app
without re-running the generator.

However, you'll need to re-run the generator if you make changes to either of
these files:

    lib/generators/ornament/templates/app/assets/ornament/_defaults.css.scss
    lib/generators/ornament/templates/app/views/layouts/global.html.erb

When you run the generator, use this command to ensure you only regenerate the
global layout and settings files:

    rails g ornament --development -f

## JavaScript Guidelines

Use [JSLint](http://www.jslint.com/) with the following settings to validate
your JavaScript files:

    /*jslint browser: true, indent: 2, todo: true, unparam: true */
    /*global jQuery*/
