# Sower Prep

## Description

Sower Prep is a web application designed to help children's ministry teachers create, organize, view, and manage Bible lesson plans.

Teachers can create lessons for different ministry age groups, save their lesson information in a database, view complete lessons, edit lessons, and delete lessons.

The application currently supports:

- Calvary Kids — 2–5
- Calvary Kids — K–3
- The 45

## What the Application Does

The application allows authenticated teachers to:

- Create an account
- Log in and log out
- Create new ministry lessons
- Select a ministry and curriculum format
- Add Bible story information
- Add Bible references
- Add memory verses
- Add discussion questions
- Add activities
- Add prayer information
- Add take-home information
- Add teacher notes
- View complete lessons
- Edit existing lessons
- Delete lessons
- Store lesson information in a database

Each teacher's lessons are associated with their authenticated account.

## Technologies Used

- HTML
- CSS
- JavaScript
- Supabase
  - Supabase Authentication
  - Supabase Database
  - Row Level Security
- Git
- GitHub
- Netlify

## Application Architecture

The application uses a simple frontend/backend architecture.

### Frontend

The frontend is built with:

- HTML
- CSS
- JavaScript

The frontend provides the user interface for registration, login, lesson creation, lesson viewing, editing, and deletion.

### Backend and Database

Supabase is used for:

- User authentication
- Storing lesson information
- Controlling access to user data

The `lessons` table stores the application's lesson data.

Row Level Security policies ensure that authenticated users can access and modify their own lessons.

## Project Structure

```text
sower-prep/
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-lesson.html
├── view-lesson.html
├── edit-lesson.html
├── style.css
├── script.js
├── supabase.js
└── README.md
```

## GitHub Repository

[View the GitHub Repository](https://github.com/ItsEzzyBro/sower-prep)

## Deployed Application

[Open Sower Prep](https://sower-prep.netlify.app)

## Setup Instructions

To run Sower Prep locally:

1. Clone the repository to your computer.
2. Open the project folder in Visual Studio Code.
3. Configure the Supabase connection in `supabase.js`.
4. Run the application using the Live Server extension in Visual Studio Code.
5. Open the application in your browser.
6. Register a new account or log in to begin creating and managing lessons.

## Demo Video

Demo video coming soon.
