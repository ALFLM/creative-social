# Creative Social Network

## Overview
This project is a creative social network that allows users to draw and share their creations. Instead of posting photos, users can create drawings directly on the platform. Each user has a customizable profile page where they can showcase their artwork.

## Features
- Drawing canvas for users to create and edit their artwork.
- Customizable user profiles to display creations.
- User authentication for secure access.
- Database integration to store user drawings and profiles.

## Project Structure
```
creative-social
├── public
│   ├── index.html          # Main entry point of the application
│   ├── editor.html         # Interface for creating and editing drawings
│   ├── profile.html        # User profile page
│   └── styles
│       └── main.css        # Styles for the application
├── src
│   ├── js
│   │   ├── app.js          # Initializes the application
│   │   ├── drawing.js      # Drawing functionality
│   │   ├── profile.js      # User profile management
│   │   └── storage.js      # Data storage handling
│   ├── components
│   │   └── canvas-widget.js # Drawing canvas component
│   └── sql
│       ├── schema.sql      # Database schema definition
│       └── migrations
│           └── 001_init.sql # Initial database migration
├── netlify
│   └── functions
│       ├── createPost.js    # Function to create new posts
│       ├── getPosts.js      # Function to retrieve posts
│       └── auth.js          # User authentication function
├── scripts
│   └── deploy.sh            # Deployment script for Netlify
├── package.json             # npm configuration file
├── .gitignore               # Files to ignore in Git
└── README.md                # Project documentation
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the necessary dependencies using npm:
   ```
   npm install
   ```
4. Set up the database using the provided SQL schema and migration files.
5. Deploy the application to Netlify using the deploy script:
   ```
   ./scripts/deploy.sh
   ```

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.