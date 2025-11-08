# Food 4 All App Guidelines// Used with copiolt,looking up other guidlines, and myself  

## General Guidelines

* The app is optimized for iPhone 16 dimensions (393x852 logical pixels)
* Follow iOS design patterns with proper safe areas and native feel
* Use Tailwind CSS for styling
* Keep components modular and in separate files
* Refactor code as you go to keep it clean and maintainable
* Use responsive layouts with flexbox by default

## Design System

* The app uses a clean, accessible design focused on usability
* Primary color scheme: Blue (#3B82F6) for primary actions
* Bottom navigation should always have exactly 4 items: Home, Map, Recipes, Settings
* Use consistent spacing and padding throughout the app
* Icons should be from lucide-react library
* Font sizes and weights are managed through globals.css - do not override unless necessary

## App-Specific Rules

### Authentication
* The app uses Supabase for backend authentication
* Login and SignUp screens should handle errors gracefully
* Session state should be managed in App.tsx and passed to components as needed

### Navigation
* Bottom navigation is always visible on main screens
* Use consistent navigation patterns across all screens
* Back buttons should be provided for sub-screens

### Location Services
* Google Maps API key: AIzaSyCmRo0hAWbPvXLs6orDjsRLLSkjXfthAv0
* Map should show food banks and food assistance locations in San Francisco
* Use proper error handling for location services

### AI Features
* Claude API key: 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
* Use Claude model: claude-3-5-sonnet-20240620 (not 20241022)
* Recipe generation should focus on common food bank ingredients: rice, beans, pasta, canned goods, eggs, and bread
* Image recognition should identify food items from photos

### Content Guidelines
* Use respectful, inclusive language
* Focus on helping users find food resources with dignity
* Provide clear, actionable information
* Error messages should be helpful and not blame the user

### Feature-Specific Rules

#### Home Screen
* Show quick access to main features
* Display helpful tips and information
* Include easy navigation to map and recipes

#### Map Screen
* Show 12 diverse food bank locations across different San Francisco neighborhoods
* Include markers for each location
* Allow users to save favorite locations
* Show location details when markers are tapped

#### Recipes Screen
* Focus on affordable, nutritious recipes using common food bank ingredients
* Include AI-powered recipe generation
* Support camera-based food recognition
* Recipes should be easy to follow with simple instructions

#### Settings Screen
* Include sections for: Account, Food Preferences, Location, Notifications, Help & Info
* Each setting should be clearly labeled and easy to access
* Provide clear feedback when settings are changed

### Data Management
* Use Supabase for backend data storage
* Handle offline scenarios gracefully
* Cache data when appropriate to improve performance
* Respect user privacy and data
