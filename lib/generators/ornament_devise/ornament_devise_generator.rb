class OrnamentDeviseGenerator < Rails::Generators::Base

  source_root File.expand_path('../templates', __FILE__)
  argument :model, type: :string, default: "users"

  def generate
    directory "app/views/devise", "app/views/#{model}"
  end
  
end
