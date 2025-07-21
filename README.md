# WordPress React App

A modern React application with WordPress integration and contact form functionality.

## Features

- **WordPress Integration**: Fetches content from WordPress REST API
- **Multi-language Support**: English and Spanish
- **Dark/Light Theme**: Toggle between themes
- **Contact Form**: Email functionality using Resend
- **Responsive Design**: Built with Bulma CSS framework
- **Animations**: GSAP animations for smooth scrolling effects
- **Material-UI Components**: Modern UI components

## Contact Form Setup

The app includes a contact form that sends emails using Resend. To set it up:

### 1. Backend Server Setup

```bash
cd server
npm install
cp env.example .env
```

Edit the `.env` file with your Resend API key and email configuration.

### 2. Start the Backend Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:3001`

### 3. Resend Configuration

1. Sign up at [Resend](https://resend.com)
2. Get your API key from the dashboard
3. Add your API key to the server `.env` file
4. Configure your email addresses

### 4. Test the Contact Form

Start both the React app and the backend server, then test the contact form in the Contact section.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- WordPress site with REST API enabled

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure WordPress API in `src/lib/wp.ts`

4. Start the development server:
   ```bash
   npm start
   ```

5. For contact form functionality, also start the backend server:
   ```bash
   cd server
   npm run dev
   ```

## Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run deploy` - Deploy to GitHub Pages

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ContactForm/    # Contact form with Resend
│   ├── Card/          # Post cards
│   ├── Layout/        # Main layout
│   └── ...
├── pages/             # Page components
├── context/           # React context
├── lib/              # WordPress API utilities
└── utils/            # Utility functions

server/               # Backend server for email functionality
├── server.js        # Express server with Resend
├── package.json     # Server dependencies
└── README.md        # Server setup instructions
```

## Technologies Used

- **Frontend**: React, TypeScript, Material-UI, Bulma
- **Backend**: Node.js, Express, Resend
- **Animations**: GSAP
- **State Management**: React Query
- **Styling**: SCSS, Material-UI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
