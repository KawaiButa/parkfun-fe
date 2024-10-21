# Parking Booking Project

This NextJS project allows users to book parking locations using Azure Map API. It utilizes Material-UI (MUI) for the user interface and Redux for state management.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Material-UI (MUI)](https://mui.com/)
- [React-hook-form](https://react-hook-form.com/)
- [Azure Maps API](https://azure.microsoft.com/en-us/services/azure-maps/)
- [Cypress](https://www.cypress.io/) (for testing)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm (v6 or later) or Yarn

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/your-username/parking-booking-project.git
   cd parking-booking-project
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your Azure Maps API key:
   ```
    NEXT_PUBLIC_AZURE_MAPS_KEY=your_azure_maps_api_key
    NEXT_PUBLIC_BACKEND_HOSTNAME=your_backend_hostname
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
    NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
    NEXT_PUBLIC_BASE_URL=your_base_url
   ```

4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
parking-booking-project/
├── .github/
├── .husky/
├── .next/
├── cypress/
├── node_modules/
├── public/
│   └── images/
│       ├── background.jpg
│       ├── defaultUserAvatar.jpg
│       ├── logo.png
│       └── noImage.jpg
├── src/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── interfaces/
│   ├── themes/
│   ├── utils/
│   ├── constants.ts
│   ├── instrumentation.ts
│   └── middleware.ts
├── .env.local
├── next.config.js
├── package.json
└── README.md
```

## Building for Production

To build the application for production, run:

```
npm run build
# or
yarn build
```

This will create an optimized production build in the `.next` folder.

To start the production server, run:

```
npm start
# or
yarn start
```

Your application will be available at `http://localhost:3000`.

## Deployment

This project is deployed using [Vercel](https://vercel.com/), a cloud platform for static sites and Serverless Functions that fits perfectly with Next.js projects.

To deploy your project to Vercel:

1. Push your code to a GitHub repository.

2. Go to [Vercel](https://vercel.com/) and sign up or log in.

3. Click on "Import Project" and select "From Git Repository".

4. Choose your GitHub repository and follow the setup instructions.

5. Configure your environment variables (like `NEXT_PUBLIC_AZURE_MAPS_KEY`) in the Vercel dashboard.

6. Vercel will automatically deploy your project and provide you with a URL.

For subsequent deployments, simply push to your main branch, and Vercel will automatically redeploy your application.

For more detailed instructions, refer to the [Vercel Documentation](https://vercel.com/docs).