# MedTourX

MedTourX is a web platform designed to connect patients with hospitals and tourism services for medical travel. It provides hospital listings, booking, and integrates tourism options for a seamless medical tourism experience.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Environment Variables](#environment-variables)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- User authentication (login/signup)
- Hospital listings and details
- Booking and inquiry system
- Integration with tourism services
- Responsive UI with Tailwind CSS

## Project Structure

```
MedTourX/
├── my-app/                # React frontend application
├── server/                # Node.js backend server
├── Login-signup/          # Login/signup module (Vite + React)
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd MedTourX
   ```

2. **Install dependencies for frontend:**
   ```sh
   cd my-app
   npm install
   ```

3. **Install dependencies for backend:**
   ```sh
   cd ../server
   npm install
   ```

### Running the Application

1. **Start the backend server:**
   ```sh
   cd server
   npm start
   ```

2. **Start the frontend development server:**
   ```sh
   cd ../my-app
   npm start
   ```

3. **(Optional) Start the login/signup module:**
   ```sh
   cd ../Login-signup/login-signup/login-signup-v2
   npm install
   npm run dev
   ```

### Environment Variables

- Create `.env` files in the `server` and `my-app` directories for API keys, database URLs, and secrets as needed.

## Technologies Used

- React, Vite, Create React App
- Node.js, Express
- Tailwind CSS
- Firebase (for authentication)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact [your-email@example.com](mailto:your-email@example.com).