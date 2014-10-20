class OrnamentGenerator < Rails::Generators::Base

  source_root File.expand_path("../templates", __FILE__)

  class_option :components,   :type => :boolean, :default => true
  class_option :core,         :type => :boolean, :default => true
  class_option :development,  :type => :boolean, :default => false
  class_option :gems,         :type => :boolean, :default => true
  class_option :layouts,      :type => :boolean, :default => true
  class_option :settings,     :type => :boolean, :default => true
  class_option :styleguide,   :type => :boolean, :default => true
  class_option :example,      :type => :boolean, :default => false
  class_option :uploader,     :type => :boolean, :default => false

  def generate

    if options.settings?
      copy_file "../../../../test/dummy/app/assets/stylesheets/_settings.css.scss", "app/assets/stylesheets/_settings.css.scss"
    end

    if options.uploader?

      # drag and drop image uploader dependancies
      route "resources :uploads do"
      route "  post :image, on: :collection"
      route "end"
      copy_file "app/controllers/uploads_controller.rb"
      copy_file "app/views/koi/crud/_form_field_image.html.erb"

    else

      unless options.development?

        if options.core?

          copy_file "app/assets/stylesheets/application.css.scss"
          remove_file "app/assets/stylesheets/application.css"
          copy_file "app/assets/stylesheets/styleguide.css.scss"

        end

        if options.gems? && !options.example?
          gem_group :assets do
            gem 'sass',           '~> 3.2.18'
            gem "sass-rails",     "~> 3.2.6"
            gem "uglifier",       ">= 1.0.3"
            gem "compass-rails",  "~> 1.1.7"
          end
        end

        if options.core?

          copy_file "app/assets/javascripts/application.js"
          copy_file "app/assets/javascripts/application_bottom.js"
          copy_file "app/assets/javascripts/settings.js"
          directory "app/assets/javascripts/ornament"

          copy_file "app/assets/stylesheets/_fonts.css.scss"
          directory "app/assets/stylesheets/ornament"

          directory "app/assets/images"
          directory "app/assets/icons"

          copy_file "config/initializers/simple_form.rb"
          copy_file "config/locales/en.yml"

          copy_file "Gruntfile.js"
          copy_file "package.json"
        end

        if options.components?
          directory "app/assets/javascripts/components"
          directory "app/assets/stylesheets/components"
          directory "app/assets/stylesheets/grunticon"
          directory "vendor/assets"
        end

        if options.layouts? && !options.example?
          directory "app/views/layouts"
          directory "app/views/errors"
          directory "app/views/kaminari"
          directory "app/views/shared"
        end

        if options.styleguide?

          directory "app/views/styleguide"

          unless options.example?
            route "get '/styleguide' => 'styleguide#index'"
            route "get '/styleguide/:action' => 'styleguide'"

            copy_file "app/controllers/styleguide_controller.rb"
          end

        end

      end

    end

  end

end
