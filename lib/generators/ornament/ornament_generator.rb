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
  class_option :uploader,     :type => :boolean, :default => true

  def generate

    if options.settings?
      copy_file "../../../../test/dummy/app/assets/stylesheets/_settings.scss", "app/assets/stylesheets/_settings.scss"
    end

    unless options.development?

      if options.core?

        copy_file "app/assets/stylesheets/application.scss"
        remove_file "app/assets/stylesheets/application.css"
        copy_file "app/assets/stylesheets/styleguide.scss"

      end

      if options.uploader?

        # drag and drop image uploader dependancies
        route "end"
        route "  post :image, on: :collection"
        route "resources :uploads do"
      
        copy_file "app/controllers/uploads_controller.rb"
        copy_file "app/views/koi/crud/_form_field_uploader.html.erb"

      end

      if options.core?

        copy_file "app/assets/javascripts/application.js"
        copy_file "app/assets/javascripts/application_bottom.js"
        copy_file "app/assets/javascripts/settings.js"
        copy_file "app/assets/javascripts/styleguide.js"
        directory "app/assets/javascripts/ornament"
        directory "app/assets/javascripts/utilities"

        copy_file "app/assets/stylesheets/_fonts.scss"
        directory "app/assets/stylesheets/ornament"

        directory "app/assets/images"
        directory "app/assets/icons"

        copy_file "config/initializers/simple_form.rb"
        copy_file "../../../../test/dummy/config/initializers/datetime_formats_ornament.rb", "config/initializers/datetime_formats_ornament.rb"
        copy_file "config/locales/en.yml"

        copy_file "Gruntfile.js"
        copy_file "package.json"
        copy_file ".editorconfig.ini"
        copy_file ".eslintrc.json"
        copy_file ".sass-lint.yml"
      end

      if options.components?
        directory "app/assets/javascripts/components"
        directory "app/assets/stylesheets/aspects"
        directory "app/assets/stylesheets/components"
        directory "app/assets/stylesheets/grunticon"
        directory "vendor/assets"
      end

      if options.layouts? 
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
          copy_file "../../../../test/dummy/app/helpers/application_helper.rb", "app/helpers/application_helper.rb"
        end

      end

    end

    puts ""
    puts "Ornament is now installed! But wait, in case you haven't already, please follow these manual steps to complete installation:"
    puts ""
    puts "Please ensure the following gems are in your local Gemfile:"
    puts ""
    puts "  gem 'sass-rails', '~> 5.0.6'"
    puts "  gem 'uglifier', '~> 3.0.4'"
    puts "  gem 'compass-rails', '~> 3.0.2'"
    puts "  gem 'htmlentities', '~> 4.3.4'"
    puts "  gem 'css_splitter', '~> 0.4.6'"
    puts ""
    puts "Please add this line to asset.rb:"
    puts ""
    puts "  Rails.application.config.assets.precompile += %w( application_split2.css  selectivizr.js respond.js application_bottom.js styleguide.css styleguide_split2.css styleguide.js )"
    puts ""
    puts "Then bundle and restart your server"
    puts ""

  end

end
