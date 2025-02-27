# MyApp - React + Vite

MyApp is a React project built with Vite, providing a user interface for managing products.

## Installation

To install and run the project locally, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/myApp.git
   cd myApp
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Features

- Display a list of products with pagination.
- Add a new product with name, price, and description.

## Project Structure

- `src/App.jsx`: Main component that includes the product list and the form to add a new product.
- `src/config/config.js`: Configuration file for API base URL.

## API

The project uses a RESTful API to manage products. The following endpoints are used:

- `GET /products?page={page}`: Fetch a paginated list of products.
- `POST /products`: Add a new product.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License.
