class StyleguideController < ActionController::Base

  if defined?(Koi) 
    include CommonControllerActions
  end

  layout :styleguide_layout

  def form
    @months = {
      "1 - January" => 1,
      "2 - February" => 2,
      "3 - March" => 3,
      "4 - April" => 4,
      "5 - May" => 5,
      "6 - June" => 6,
      "7 - July" => 7,
      "8 - August" => 8,
      "9 - September" => 9,
      "10 - October" => 10,
      "11 - November" => 11,
      "12 - December" => 12
    }
    @years = (Time.current.year..Time.current.year+10)
    @countries = {
      "Australia" => "AU",
      "Afghanistan" => "AF",
      "Albania" => "AL",
      "Algeria" => "DZ",
      "American Samoa" => "AS",
      "Andorra" => "AD",
      "Angola" => "AO",
      "Anguilla" => "AI",
      "Antarctica" => "AQ",
      "Antigua and Barbuda" => "AG",
      "Argentina" => "AR",
      "Armenia" => "AM",
      "Aruba" => "AW",
      "Australia" => "AU",
      "Austria" => "AT",
      "Azerbaijan" => "AZ",
      "Bahamas" => "BS",
      "Bahrain" => "BH",
      "Bangladesh" => "BD",
      "Barbados" => "BB",
      "Belarus" => "BY",
      "Belgium" => "BE",
      "Zimbabwe" => "ZW",
    }
  end

  private

  def styleguide_layout
    layout = "styleguide/ornament"
    layout = "application" if params[:no_layout]
    layout
  end
end
