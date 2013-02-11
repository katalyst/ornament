class OrnamentGenerator < Rails::Generators::Base

  source_root File.expand_path("../templates", __FILE__)

  class_option :gems,      :type => :boolean, :default => true
  class_option :core,      :type => :boolean, :default => true
  class_option :prototype, :type => :boolean, :default => true
  class_option :theme,     :type => :boolean, :default => true
  class_option :extras,    :type => :boolean, :default => true
  class_option :cleanup,   :type => :boolean, :default => true

  def gems
    if options.gems?
      gem_group :assets do
        gem "sass-rails",    "~> 3.2.3"
        gem "coffee-rails",  "~> 3.2.1"
        gem "uglifier",      ">= 1.0.3"
        gem "compass-rails", "~> 1.0.3"
      end
    end
  end

  def core
    if options.core?
      copy_file "app/assets/stylesheets/application.css.scss"

      copy_file "app/assets/stylesheets/_fonts.css.scss"
      create_settings "app/assets/stylesheets/_settings.css.scss"
      copy_file "app/assets/stylesheets/ornament/_core.css.scss"
      copy_file "app/assets/stylesheets/ornament/_defaults.css.scss"
      copy_file "app/assets/stylesheets/ornament/_reset.css.scss"
      copy_file "app/assets/stylesheets/ornament/helpers/_color.css.scss"
      copy_file "app/assets/stylesheets/ornament/helpers/_rem.css.scss"
      copy_file "app/assets/stylesheets/ornament/utilities/_font.css.scss"
      copy_file "app/assets/stylesheets/ornament/utilities/_pinned-footer.css.scss"
      copy_file "app/assets/stylesheets/ornament/utilities/_simple-link-colors.css.scss"
    end
  end

  def prototype
    if options.prototype?
      copy_file "app/assets/images/prototype/header/logo.png"
      copy_file "app/assets/stylesheets/prototype/_align.css.scss"
      copy_file "app/assets/stylesheets/prototype/_button.css.scss"
      copy_file "app/assets/stylesheets/prototype/_clearfix.css.scss"
      copy_file "app/assets/stylesheets/prototype/_field.css.scss"
      copy_file "app/assets/stylesheets/prototype/_float.css.scss"
      copy_file "app/assets/stylesheets/prototype/_footer.css.scss"
      copy_file "app/assets/stylesheets/prototype/_header.css.scss"
      copy_file "app/assets/stylesheets/prototype/_heading.css.scss"
      copy_file "app/assets/stylesheets/prototype/_island.css.scss"
      copy_file "app/assets/stylesheets/prototype/_layout.css.scss"
      copy_file "app/assets/stylesheets/prototype/_rhythm.css.scss"
      copy_file "app/assets/stylesheets/prototype/_nav.css.scss"
      copy_file "app/assets/stylesheets/prototype/_split.css.scss"
      copy_file "app/assets/stylesheets/prototype/_table.css.scss"
    end
  end

  def theme
    if options.theme?
      copy_file "app/assets/images/prototype/header/logo.png",          "app/assets/images/theme/header/logo.png"
      copy_file "app/assets/stylesheets/prototype/_align.css.scss",     "app/assets/stylesheets/theme/_align.css.scss"
      copy_file "app/assets/stylesheets/prototype/_button.css.scss",    "app/assets/stylesheets/theme/_button.css.scss"
      copy_file "app/assets/stylesheets/prototype/_clearfix.css.scss",  "app/assets/stylesheets/theme/_clearfix.css.scss"
      copy_file "app/assets/stylesheets/prototype/_field.css.scss",     "app/assets/stylesheets/theme/_field.css.scss"
      copy_file "app/assets/stylesheets/prototype/_float.css.scss",     "app/assets/stylesheets/theme/_float.css.scss"
      copy_file "app/assets/stylesheets/prototype/_footer.css.scss",    "app/assets/stylesheets/theme/_footer.css.scss"
      copy_file "app/assets/stylesheets/prototype/_header.css.scss",    "app/assets/stylesheets/theme/_header.css.scss"
      copy_file "app/assets/stylesheets/prototype/_heading.css.scss",   "app/assets/stylesheets/theme/_heading.css.scss"
      copy_file "app/assets/stylesheets/prototype/_island.css.scss",    "app/assets/stylesheets/theme/_island.css.scss"
      copy_file "app/assets/stylesheets/prototype/_layout.css.scss",    "app/assets/stylesheets/theme/_layout.css.scss"
      copy_file "app/assets/stylesheets/prototype/_rhythm.css.scss",    "app/assets/stylesheets/theme/_rhythm.css.scss"
      copy_file "app/assets/stylesheets/prototype/_nav.css.scss",       "app/assets/stylesheets/theme/_nav.css.scss"
      copy_file "app/assets/stylesheets/prototype/_split.css.scss",     "app/assets/stylesheets/theme/_split.css.scss"
      copy_file "app/assets/stylesheets/prototype/_table.css.scss",     "app/assets/stylesheets/theme/_table.css.scss"
    end
  end

  def extras
    if options.extras?
      copy_file "app/views/layouts/application.html.erb"
      copy_file "vendor/assets/javascripts/IE9.js"
    end
  end

  def cleanup
    if options.cleanup?
      if yes?("Remove the current 'application.css' file?")
        remove_file "app/assets/stylesheets/application.css"
      end
    end
  end

private

  def create_settings(path)
    copy_file "app/assets/stylesheets/ornament/_defaults.css.scss", path
    gsub_file path, /^\$/, "//$"
    gsub_file path, /\s*\!default;/, ";"
    gsub_file path, "\n//\n// Don't change settings here, do it in settings.css.scss.", ""
  end

end
