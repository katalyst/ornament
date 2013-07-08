class OrnamentGenerator < Rails::Generators::Base

  source_root File.expand_path("../templates", __FILE__)

  class_option :development,  :type => :boolean, :default => false
  class_option :experimental, :type => :boolean, :default => false
  class_option :gems,         :type => :boolean, :default => true
  class_option :settings,     :type => :boolean, :default => true

  def gems
    if options.gems? && !options.development?
      gem_group :assets do
        gem "sass-rails",    "~> 3.2.3"
        gem "uglifier",      ">= 1.0.3"
        gem "compass-rails", "~> 1.0.3"
      end
    end
  end

  def core
    unless options.development?
      copy_file "app/assets/javascripts/application.js"
      directory "app/assets/javascripts/ornament"
      copy_file "app/assets/stylesheets/application.css.scss"
      copy_file "app/assets/stylesheets/_fonts.css.scss"
      directory "app/assets/stylesheets/ornament"
      copy_file "vendor/assets/javascripts/jquery.livequery.js"
    end
  end

  def settings
    if options.settings?
      copy_file "app/assets/stylesheets/ornament/_defaults.css.scss", "app/assets/stylesheets/_settings.css.scss"
      gsub_file "app/assets/stylesheets/_settings.css.scss", /\s*\!default;/, ";"
    end
  end

  def components
    unless options.development?
      directory "app/assets/javascripts/components"
      directory "app/assets/stylesheets/components"
    end
  end

  def experimental
    if options.experimental? && !options.development?
      directory "app/assets/javascripts/experimental"
      directory "app/assets/stylesheets/experimental"
    end
  end

  def ie_support
    unless options.development?
      copy_file "vendor/assets/javascripts/IE9.js"
      copy_file "vendor/assets/javascripts/css3-mediaqueries.js"
    end
  end

  def layouts
    template "app/views/layouts/global.html.erb"
    unless options.development?
      copy_file "app/views/layouts/application.html.erb"
    end
  end

  def styleguide
    unless options.development?
      route "match '/styleguide' => 'application#styleguide'"
      copy_file "app/views/application/styleguide.html.erb"
    end
  end

  def cleanup
    unless options.development?
      if yes?("Remove the existing 'application.css' file (a 'application.css.scss' file has been created to replace it)?")
        remove_file "app/assets/stylesheets/application.css"
      end
    end
  end

end
