class OrnamentGenerator < Rails::Generators::Base

  source_root File.expand_path("../templates", __FILE__)

  class_option :gems,       :type => :boolean, :default => true
  class_option :core,       :type => :boolean, :default => true
  class_option :theme,      :type => :boolean, :default => true
  class_option :ie_support, :type => :boolean, :default => true
  class_option :layouts,    :type => :boolean, :default => true
  class_option :styleguide, :type => :boolean, :default => true
  class_option :cleanup,    :type => :boolean, :default => true

  def gems
    if options.gems?
      gem_group :assets do
        gem "sass-rails",    "~> 3.2.3"
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

  def theme
    if options.theme?

      copy_file "app/assets/stylesheets/theme/_align.css.scss"
      copy_file "app/assets/stylesheets/theme/_button.css.scss"
      copy_file "app/assets/stylesheets/theme/_clearfix.css.scss"
      copy_file "app/assets/stylesheets/theme/_field.css.scss"
      copy_file "app/assets/stylesheets/theme/_float.css.scss"
      copy_file "app/assets/stylesheets/theme/_footer.css.scss"
      copy_file "app/assets/stylesheets/theme/_header.css.scss"
      copy_file "app/assets/stylesheets/theme/_heading.css.scss"
      copy_file "app/assets/stylesheets/theme/_island.css.scss"
      copy_file "app/assets/stylesheets/theme/_layout.css.scss"
      copy_file "app/assets/stylesheets/theme/_rhythm.css.scss"
      copy_file "app/assets/stylesheets/theme/_nav.css.scss"
      copy_file "app/assets/stylesheets/theme/_split.css.scss"
      copy_file "app/assets/stylesheets/theme/_table.css.scss"
    end
  end

  def ie_support
    if options.ie_support?
      copy_file "vendor/assets/javascripts/IE9.js"
    end
  end

  def layouts
    if options.layouts?
      template "app/views/layouts/global.html.erb"
      copy_file "app/views/layouts/application.html.erb"
    end
  end

  def styleguide
    if options.styleguide?
      route "match '/styleguide' => 'application#styleguide'"
      copy_file "app/views/application/styleguide.html.erb"
    end
  end

  def cleanup
    if options.cleanup?
      if yes?("Remove the existing 'application.css' file?")
        remove_file "app/assets/stylesheets/application.css"
      end
    end
  end

private

  def create_settings(path)
    copy_file "app/assets/stylesheets/ornament/_defaults.css.scss", path
    gsub_file path, /\s*\!default;/, ";"
    gsub_file path, "\n//\n// Don't change settings here, do it in _settings.css.scss.", ""
  end

end
