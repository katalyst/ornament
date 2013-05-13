class OrnamentGenerator < Rails::Generators::Base

  source_root File.expand_path("../templates", __FILE__)

  class_option :gems,         :type => :boolean, :default => true
  class_option :core,         :type => :boolean, :default => true
  class_option :settings,     :type => :boolean, :default => true
  class_option :components,   :type => :boolean, :default => true
  class_option :experimental, :type => :boolean, :default => false
  class_option :ie_support,   :type => :boolean, :default => true
  class_option :layouts,      :type => :boolean, :default => true
  class_option :styleguide,   :type => :boolean, :default => true
  class_option :cleanup,      :type => :boolean, :default => true

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
      copy_file "app/assets/javascripts/application.js"
      copy_file "app/assets/stylesheets/application.css.scss"
      copy_file "app/assets/stylesheets/_fonts.css.scss"
      copy_file "app/assets/stylesheets/ornament/_core.css.scss"
      copy_file "app/assets/stylesheets/ornament/_defaults.css.scss"
      copy_file "app/assets/stylesheets/ornament/_reset.css.scss"
      copy_file "app/assets/stylesheets/ornament/_style.css.scss"
      copy_file "app/assets/stylesheets/ornament/helpers/_color.css.scss"
      copy_file "app/assets/stylesheets/ornament/helpers/_rem.css.scss"
      copy_file "app/assets/stylesheets/ornament/utilities/_color-set.css.scss"
      copy_file "app/assets/stylesheets/ornament/utilities/_font.css.scss"
      copy_file "app/assets/stylesheets/ornament/utilities/_pinned-footer.css.scss"
      copy_file "app/assets/stylesheets/ornament/utilities/_simple-link-colors.css.scss"
    end
  end

  def settings
    if options.settings?
      copy_file "app/assets/stylesheets/ornament/_defaults.css.scss", "app/assets/stylesheets/_settings.css.scss"
      gsub_file "app/assets/stylesheets/_settings.css.scss", /\s*\!default;/, ";"
    end
  end

  def components
    if options.components?
      copy_file "app/assets/javascripts/components/accessibility.js"
      copy_file "app/assets/javascripts/components/layout.js"
      copy_file "app/assets/javascripts/components/navigation.js"
      copy_file "app/assets/javascripts/components/tooltip.js"
      copy_file "app/assets/stylesheets/components/_accessibility.css.scss"
      copy_file "app/assets/stylesheets/components/_button.css.scss"
      copy_file "app/assets/stylesheets/components/_footer.css.scss"
      copy_file "app/assets/stylesheets/components/_header.css.scss"
      copy_file "app/assets/stylesheets/components/_layout.css.scss"
      copy_file "app/assets/stylesheets/components/_navigation.css.scss"
      copy_file "app/assets/stylesheets/components/_styleguide.css.scss"
      copy_file "app/assets/stylesheets/components/_tooltip.css.scss"
    end
  end

  def experimental
    if options.experimental?
      copy_file "app/assets/stylesheets/experimental/_align.css.scss"
      copy_file "app/assets/stylesheets/experimental/_clearfix.css.scss"
      copy_file "app/assets/stylesheets/experimental/_field.css.scss"
      copy_file "app/assets/stylesheets/experimental/_float.css.scss"
      copy_file "app/assets/stylesheets/experimental/_heading.css.scss"
      copy_file "app/assets/stylesheets/experimental/_island.css.scss"
      copy_file "app/assets/stylesheets/experimental/_rhythm.css.scss"
      copy_file "app/assets/stylesheets/experimental/_split.css.scss"
      copy_file "app/assets/stylesheets/experimental/_table.css.scss"
    end
  end

  def ie_support
    if options.ie_support?
      copy_file "vendor/assets/javascripts/IE9.js"
      copy_file "vendor/assets/javascripts/css3-mediaqueries.js"
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
      if yes?("Remove the existing 'application.css' file (a 'application.css.scss' file has been created instead)?")
        remove_file "app/assets/stylesheets/application.css"
      end
    end
  end

end
