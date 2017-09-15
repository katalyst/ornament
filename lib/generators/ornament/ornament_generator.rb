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
  class_option :helpers,      :type => :boolean, :default => true

  GEMS = {
    'sass-rails'    => '~> 5.0.0',
    'uglifier'      => '>= 1.0.3',
    'htmlentities'  => '~> 4.3.4',
  }

  def generate

    if options.gems?
      gemfile = File.read('Gemfile')
      GEMS.each do |name, version|
        unless gemfile.include?(name)
          if version.present?
            gem name.dup, version
          else
            gem name.dup
          end
        end
      end
    end

    if options.settings?
      copy_file "../../../../test/dummy/app/assets/stylesheets/_settings.scss", "app/assets/stylesheets/_settings.scss"
    end

    unless options.development?

      if options.core?
        copy_file "app/assets/stylesheets/application.scss"
        remove_file "app/assets/stylesheets/application.css"
      end

      if options.uploader?
        unless options.example?
          # drag and drop image uploader dependancies
          route "end"
          route "  post :image, on: :collection"
          route "resources :uploads do"
          copy_file "app/controllers/uploads_controller.rb"
        end
        copy_file "app/views/koi/crud/_form_field_uploader.html.erb"
      end

      if options.core?

        copy_file "app/assets/javascripts/application.js"
        directory "app/assets/javascripts/ornament"

        copy_file "app/assets/stylesheets/_print.scss"
        directory "app/assets/stylesheets/ornament"

        directory "app/assets/images"
        
        copy_file "config/initializers/simple_form.rb"
        copy_file "config/initializers/ornament.rb"
        copy_file "../../../../test/dummy/config/initializers/datetime_formats_ornament.rb", "config/initializers/datetime_formats_ornament.rb"
        copy_file "config/locales/en.yml"
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

      if options.helpers?
        copy_file "../../../../test/dummy/app/helpers/ornament_helper.rb", "app/helpers/ornament_helper.rb"
        copy_file "../../../../test/dummy/app/helpers/ornament_seo_helper.rb", "app/helpers/ornament_seo_helper.rb"
        copy_file "../../../../test/dummy/app/helpers/ornament_koi_helper.rb", "app/helpers/ornament_koi_helper.rb"
        copy_file "../../../../test/dummy/app/helpers/ornament_google_maps_helper.rb", "app/helpers/ornament_google_maps_helper.rb"
      end

      if options.styleguide?
        directory "app/views/styleguide"
        directory "app/assets/javascripts/styleguide"
        directory "app/assets/stylesheets/styleguide"

        unless options.example?
          route "get '/styleguide' => 'styleguide#index'"
          route "get '/styleguide/:action' => 'styleguide'"
          copy_file "app/controllers/styleguide_controller.rb"
          copy_file "../../../../test/dummy/app/helpers/ornament_helper.rb", "app/helpers/ornament_helper.rb"
          copy_file "../../../../test/dummy/app/helpers/ornament_google_maps_helper.rb", "app/helpers/ornament_google_maps_helper.rb"
          copy_file "../../../../test/dummy/app/helpers/ornament_koi_helper.rb", "app/helpers/ornament_koi_helper.rb"
          copy_file "../../../../test/dummy/app/helpers/ornament_seo_helper.rb", "app/helpers/ornament_seo_helper.rb"
        end

      end

    end

    puts ""
    puts "Ornament is now installed! But wait, in case you haven't already, please follow these manual steps to complete installation:"
    puts ""
    puts "Please ensure the following gems are in your local Gemfile:"
    puts ""
    GEMS.each do |name, version|
     puts "   gem #{name}, #{version}"
    end
    puts ""
    puts "Then bundle and restart your server"
    puts ""

  end

end
