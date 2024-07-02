# Web Service Application

This is a simple web service application built using Koa.js, designed to manage websites and their SSL certificates. It provides RESTful API endpoints to perform CRUD operations on websites and to check and notify about SSL certificate expiration.

## Features

- RESTful API for website management.
- SSL certificate expiration check.
- Automatic email notification for expiring SSL certificates.
- CORS enabled for flexible API access.
- Simple login system with token-based authentication.

## Getting Started

### Prerequisites

- Node.js (version 12.x or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/yourrepository.git
```

2. Navigate to the project directory:

```
cd yourrepository
```

3. Install dependencies:

```
npm install
```


### Running the Application

- Start the server:

```
node web.js
```

- The server will start on port 5555 by default.

## API Documentation

### Websites Management

- `GET /` - List all websites in a table format.
- `GET /website` - Retrieve all websites.
- `POST /website` - Add a new website. Requires `name`, `host`, `ssl`, and `desc`.
- `GET /website/:id` - Get a specific website by ID.
- `POST /website/:id` - Update a website by ID.
- `POST /website/delete/:id` - Delete a website by ID.

### Authentication

- `POST /login` - Login to get a token for authenticated routes.

### User Information

- `POST /user` - Get the current user's information (requires authentication).

### SSL Certificate Management

- `POST /update` - Manually update SSL certificate expiration dates.
- The application also runs a timer task every 5 minutes to check and update SSL certificates automatically.

### Email Notifications

- The application will automatically send an email if an SSL certificate is expiring within 3 days.

## Configuration

- Create a `.env` file in the project root directory.
- Or update the `db.js` and `mail.js` files with your database and email service configurations.

Env file example:

```
DB_NAME = 
DB_USER = 
DB_PASS = 
DB_HOST = 
# default admin password
ADMIN_PASS = 
# JWT_SECRET
JWT_SECRET = 

SMTP_HOST = 
SMTP_PORT = 
SMTP_USER = 
SMTP_PASS = 
```

JWT_SECRET is used for token-based authentication, usually a random string with a minimum length of 32 characters.

## Contributing

Contributions are welcome! Please submit a pull request or create an issue in the GitHub repository.

## License

This project is open source and available under the [MIT License](LICENSE).