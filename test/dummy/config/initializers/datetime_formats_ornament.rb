Time::DATE_FORMATS.merge!(

  ## 19th of August 2016
  ornament_full: lambda { |time|  
    time.strftime("#{time.day.ordinalize} of %B %Y") 
  },

  ## 19th of August
  ornament_no_year: lambda { |time|  
    time.strftime("#{time.day.ordinalize} of %B") 
  },

  ## 19 Aug 2016
  ornament_short: lambda { |time|  
    time.strftime("%d %b %Y") 
  }

)
