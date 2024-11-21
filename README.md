# Custom Dashboard for TestMail.app

## Overview
This is a custom dashboard designed to view emails from TestMail.app using its API. The dashboard provides a user-friendly interface to manage and display emails efficiently.

## Features
- View incoming emails in real-time.
- Search emails based on various criteria.
- Responsive design for mobile and desktop use.

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)
- Access to the TestMail.app API

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/testmail-dashboard.git
   cd testmail-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your TestMail.app API credentials:
   ```
   VITE_API_KEY=testmail_api_key
   VITE_BASE_URL=testmail_api_url
   VITE_NAMESPACE=testmail_namespace_id
=   ```

4. Start the application:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` to view the dashboard.

## Usage
- Use the navigation menu to access different features of the dashboard.

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Thanks to the developers of TestMail.app for providing a robust API.
- Inspiration from various open-source projects.

## Contact
For any inquiries, please reach out to [26thofficial.creator@gmail.com](mailto:26thofficial.creator@gmail.com).
