SimpleNavigation.register_renderer :ornament_menu => OrnamentNavRenderer
SimpleNavigation::Configuration.run do |navigation|
  navigation.items do |primary|
    primary.item :Eu, "Eu", "#Eu"
    primary.item :magna, "magna", "#magna" do |secondary|
      secondary.item :laborum, "laborum", "#laborum"
      secondary.item :exercitation, "exercitation", "#exercitation"
      secondary.item :anim, "anim", "#anim"
    end
    primary.item :officia, "officia", "#officia"
    primary.item :eu, "eu", "#eu"
    primary.item :non, "non", "#non" do |secondary|
      secondary.item :anim, "anim", "#anim" do |tertiary|
        tertiary.item :culpa, "culpa", "#culpa"
        tertiary.item :enim, "enim", "#enim"
        tertiary.item :occaecat, "occaecat", "#occaecat"
      end
      secondary.item :sint, "sint", "#sint"
    end
    primary.item :id, "id", "#id"
  end
end