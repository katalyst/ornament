# Use this setup block to configure all options available in SimpleForm.
SimpleForm.setup do |config|

  # Default ornament layout
  config.wrappers :ornament, tag: "div", class: "control-group", error_class: "error" do |b|

    # Use HTML5 field types
    b.use :html5

    # Use I18n for placeholders
    b.use :placeholder

    # Optional attributes
    b.optional :maxlength
    b.optional :min_max
    b.optional :pattern
    b.optional :readonly

    # Group label with hint 
    b.wrapper tag: 'div', class: 'control-group--label' do |ba|
      ba.use :label
      ba.use :error, wrap_with: { :tag => 'span', class: 'error-block' }
      ba.use :hint,  wrap_with: { :tag => 'p', class: 'hint-block' }
    end

    b.wrapper :tag => 'div', :class => 'controls' do |ba|
      ba.use :input
    end
    
  end

  # Default ornament booleans
  # [input] label 
  config.wrappers :ornament_boolean, tag: 'div', class: 'control-group control-group__boolean', error_class: 'error' do |b|

    # Optional attributes
    b.optional :readonly

    b.wrapper tag: 'label', class: 'control-group__boolean--wrapper' do |ba|
      ba.use :input, wrap_with: { tag: 'div', class: 'control-group__boolean--input checkbox' }
      ba.wrapper tag: 'div', class: 'control-group__boolean--label' do |bab|
        bab.use :label
        bab.use :error, wrap_with: { :tag => 'span', class: 'error-block' }
        bab.use :hint,  wrap_with: { :tag => 'p', class: 'hint-block' }
      end
    end
  end

  # Default wrapper for all form elements
  config.default_wrapper = :ornament

  # Set default wrappers for particular field types
  # https://github.com/plataformatec/simple_form/pull/642
  config.wrapper_mappings = { 
    :boolean => :ornament_boolean 
  }

  # Define the way to render check boxes / radio buttons with labels.
  # Defaults to :nested for bootstrap config.
  #   :inline => input + label
  #   :nested => label > input
  config.boolean_style = :inline

  # Default class for buttons
  config.button_class = ''

  # Method used to tidy up errors.
  # config.error_method = :first

  # Default tag used for error notification helper.
  config.error_notification_tag = :div

  # CSS class to add for error notification helper.
  config.error_notification_class = 'panel__error panel--padding'

  # ID to add for error notification helper.
  # config.error_notification_id = nil

  # Series of attempts to detect a default label method for collection.
  # config.collection_label_methods = [ :to_label, :name, :title, :to_s ]

  # Series of attempts to detect a default value method for collection.
  # config.collection_value_methods = [ :id, :to_s ]

  # You can wrap a collection of radio/check boxes in a pre-defined tag, defaulting to none.
  # config.collection_wrapper_tag = nil

  # You can define the class to use on all collection wrappers. Defaulting to none.
  # config.collection_wrapper_class = nil

  # You can wrap each item in a collection of radio/check boxes with a tag,
  # defaulting to :span. Please note that when using :boolean_style = :nested,
  # SimpleForm will force this option to be a label.
  config.item_wrapper_tag = :label

  # You can define a class to use in all item wrappers. Defaulting to none.
  # config.item_wrapper_class = nil

  # How the label text should be generated altogether with the required text.
  # config.label_text = lambda { |label, required, explicit_label| "#{required} #{label}" }

  # You can define the class to use on all labels. Default is nil.
  config.label_class = 'control-label'

  # You can define the class to use on all forms. Default is simple_form.
  # config.form_class = :simple_form

  # You can define which elements should obtain additional classes
  # config.generate_additional_classes_for = [:wrapper, :label, :input]

  # Whether attributes are required by default (or not). Default is true.
  # config.required_by_default = true

  # Tell browsers whether to use default HTML5 validations (novalidate option).
  # Default is enabled.
  config.browser_validations = true

  # Collection of methods to detect if a file type was given.
  # config.file_methods = [ :mounted_as, :file?, :public_filename ]

  # Custom mappings for input types. This should be a hash containing a regexp
  # to match as key, and the input type that will be used when the field name
  # matches the regexp as value.
  # config.input_mappings = { /count/ => :integer }

  # Default priority for time_zone inputs.
  # config.time_zone_priority = nil

  # Default priority for country inputs.
  config.country_priority = "AU"

  # Default size for text inputs.
  # config.default_input_size = 50

  # When false, do not use translations for labels.
  # config.translate_labels = true

  # Automatically discover new inputs in Rails' autoload path.
  # config.inputs_discovery = true

  # Cache SimpleForm inputs discovery
  # config.cache_discovery = !Rails.env.development?
end
