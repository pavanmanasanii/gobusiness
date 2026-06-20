# Go Business Referral Dashboard

A React-based referral management dashboard that allows users to sign in, view referral statistics, manage referrals, search and sort referral data, and view detailed referral information.

## Features

### Authentication

* User login using email and password
* JWT token stored in cookies
* Protected routes using authentication checks
* Logout functionality

### Dashboard

* Overview metrics section
* Service summary section
* Referral sharing section
* Referral table with:

  * Search
  * Sort by date
  * Client-side pagination
* Responsive layout

### Referral Details

* View detailed information for a referral
* Displays:

  * Referral ID
  * Name
  * Service Name
  * Date
  * Profit
* Navigation back to dashboard

### Error Handling

* Loading states
* API failure states
* Custom 404 page
* Automatic redirect to `/not-found` for invalid routes

## Technologies Used

* React
* React Router DOM v6
* JavaScript (ES6+)
* CSS3
* js-cookie

## Project Structure

```text
src
├── components
│   ├── Dashboard
│   ├── Header
│   ├── Login
│   ├── NotFound
│   ├── ProtectedRoute
│   └── ReferralDetails
│
├── App.jsx
├── main.jsx
└── index.css
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project:

```bash
cd project-name
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Authentication Flow

1. User submits login credentials.
2. JWT token is received from the login API.
3. Token is stored in cookies using:

```javascript
Cookies.set('jwt_token', token)
```

4. Protected routes verify the token before rendering pages.
5. Unauthorized users are redirected to `/login`.

## API Endpoints

### Login

```http
POST /api/auth/signin
```

### Dashboard Data

```http
GET /api/referrals
```

### Search Referrals

```http
GET /api/referrals?search=<query>
```

### Sort Referrals

```http
GET /api/referrals?sort=asc
GET /api/referrals?sort=desc
```

### Referral Details

```http
GET /api/referrals?id=<referralId>
```

## Pagination

* Client-side pagination
* 10 records per page
* Previous and Next navigation
* Dynamic page numbers

## Search

* Search by referral name or service name
* API request triggered when Enter key is pressed

## Routing

| Route         | Description      |
| ------------- | ---------------- |
| /login        | Login page       |
| /             | Dashboard        |
| /referral/:id | Referral details |
| /not-found    | Not Found page   |

## Author

Pavan Manasani
