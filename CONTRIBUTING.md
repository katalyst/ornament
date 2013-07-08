Contributing to Ornament
========================

The dummy app's "app/assets" configuration includes this path:

    ../../lib/generators/ornament/templates/app/assets

The dummy app's "app/views" configuration includes this path:

    ../../lib/generators/ornament/templates/app/views

This means you can modify the files in the gem and see the changes in the app
without re-running the generator.

If you make changes to any of these files:

lib/generators/ornament/templates/app/assets/ornament/_defaults.css.scss

When you do run the generator, use this command:

    rails g ornament --skip-gems --skip-core --skip-components --skip-ie-support --skip-styleguide --skip-cleanup -f

This will make sure you don't generate the asset files, view files or gems.
