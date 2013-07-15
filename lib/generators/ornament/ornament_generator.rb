class OrnamentGenerator < Rails::Generators::Base

  source_root File.expand_path("../templates", __FILE__)

  class_option :components,   :type => :boolean, :default => true
  class_option :core,         :type => :boolean, :default => true
  class_option :development,  :type => :boolean, :default => false
  class_option :gems,         :type => :boolean, :default => true
  class_option :layouts,      :type => :boolean, :default => true
  class_option :settings,     :type => :boolean, :default => true
  class_option :styleguide,   :type => :boolean, :default => true

  def generate

    if options.settings?
      copy_file "app/assets/stylesheets/ornament/_defaults.css.scss", "app/assets/stylesheets/_settings.css.scss"
    end

    unless options.development?

      if options.core?

        copy_file "app/assets/stylesheets/application.css.scss"

        if yes?("Remove the existing 'application.css' file (a 'application.css.scss' file has been created to replace it)?")
          remove_file "app/assets/stylesheets/application.css"
        end

      end

      if options.gems?
        gem_group :assets do
          gem "sass-rails",     "~> 3.2.3"
          gem "uglifier",       ">= 1.0.3"
          gem "compass-rails",  "~> 1.0.3"
          gem "turbolinks",     "~> 1.3.0"
        end
      end

      if options.core?

        copy_file "app/assets/javascripts/application.js"
        directory "app/assets/javascripts/ornament"

        copy_file "app/assets/stylesheets/_fonts.css.scss"
        directory "app/assets/stylesheets/ornament"

      end

      if options.components?
        directory "app/assets/javascripts/components"
        directory "app/assets/stylesheets/components"
      end

      if options.layouts?
        copy_file "app/views/layouts/global.html.erb"
        copy_file "app/views/layouts/application.html.erb"
      end

      directory "vendor/assets"

      if options.styleguide?

        route "match '/styleguide' => 'styleguide#index'"
        route "match '/styleguide/:action' => 'styleguide'"

        copy_file "app/controllers/styleguide_controller.rb"
        directory "app/views/styleguide"

      end

      if yes?("Remove the existing 'application.css' file (a 'application.css.scss' file has been created to replace it)?")
        remove_file "app/assets/stylesheets/application.css"
      end

    end

  end

end
