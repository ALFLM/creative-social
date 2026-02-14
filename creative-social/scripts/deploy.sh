#!/bin/bash

# This script automates the deployment process to Netlify

# Exit immediately if a command exits with a non-zero status
set -e

# Build the project (if applicable)
# npm run build

# Deploy to Netlify
netlify deploy --prod --dir=public

echo "Deployment to Netlify completed successfully."