Contributing to Ornament
========================

The dummy app's "app/assets" configuration includes this path:

    ../../lib/generators/ornament/templates/app/assets

This means you only need to re-run the generator when you make changes to the
view files or the `_defaults.css.scss` file (because it's used to generated the
`_settings.css.scss` file).

When you do run the generator, make sure you don't generate the asset files or
gems by including these flags:

    rails g ornament --skip-gems --skip-core --skip-components --skip-cleanup -f
