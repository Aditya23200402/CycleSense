# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/feb2095f-3c47-42a7-addb-272b4ffb4f1b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/feb2095f-3c47-42a7-addb-272b4ffb4f1b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/feb2095f-3c47-42a7-addb-272b4ffb4f1b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## PCOS Prediction Feature

The CycleSense app now includes a PCOS (Polycystic Ovary Syndrome) Risk Assessment tool that uses an advanced machine learning model to evaluate your risk based on various health factors.

### Features

- AI-powered PCOS risk assessment
- Personalized recommendations based on your health data
- User-friendly multi-step form for data collection
- Detailed results with risk level and next steps

### Technical Implementation

The PCOS prediction feature consists of:

1. **Backend**: A FastAPI service running the machine learning model
   - Ensemble learning with cascading technique using three models:
     - Gaussian Naive Bayes
     - Logistic Regression
     - Decision Tree Classifier
   - Trained on health data with feature engineering
   - REST API endpoint for making predictions

2. **Frontend**: React components integrated with the CycleSense app
   - Multi-step form with validation
   - Responsive design matching the app's aesthetic
   - Clear visualization of prediction results
   - Actionable recommendations based on the assessment

### Running the PCOS Prediction Feature

You can run both the frontend and backend using Docker Compose:

```sh
# Build and start both services
docker-compose up -d

# Access the app at http://localhost:3000
# The API will be available at http://localhost:8000
```

Alternatively, you can run them separately:

**Backend:**
```sh
cd Models
pip install -r requirements.txt
python api.py
```

**Frontend:**
```sh
npm install
npm run dev
```

### Important Note

The PCOS assessment is a screening tool and not a medical diagnosis. Always consult with healthcare professionals for proper diagnosis and treatment.
