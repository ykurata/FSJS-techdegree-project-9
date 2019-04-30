
# Full Stack JavaScript Techdegree v2 - REST API Project

## Overview of the Provided Project Files

We've supplied the following files for you to use:

* The `seed` folder contains a starting set of data for your database in the form of a JSON file (`data.json`) and a collection of files (`context.js`, `database.js`, and `index.js`) that can be used to create your app's database and populate it with data (we'll explain how to do that below).
* We've included a `.gitignore` file to ensure that the `node_modules` folder doesn't get pushed to your GitHub repo.
* The `app.js` file configures Express to serve a simple REST API. We've also configured the `morgan` npm package to log HTTP requests/responses to the console. You'll update this file with the routes for the API. You'll update this file with the routes for the API.
* The `nodemon.js` file configures the nodemon Node.js module, which we are using to run your REST API.
* The `package.json` file (and the associated `package-lock.json` file) contain the project's npm configuration, which includes the project's dependencies.
* The `RESTAPI.postman_collection.json` file is a collection of Postman requests that you can use to test and explore your REST API.

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```
npm install

```

Second, ensure that you have MongoDB installed globally on your system.

* Open a `Command Prompt` (on Windows) or `Terminal` (on Mac OS X) instance and run the command `mongod` (or `sudo mongod`) to start the MongoDB daemon.
* If that command failed then you’ll need to install MongoDB.
* [How to Install MongoDB on Windows](http://treehouse.github.io/installation-guides/windows/mongo-windows.html)
* [How to Install MongoDB on a Mac](http://treehouse.github.io/installation-guides/mac/mongo-mac.html)

Third, seed your MongoDB database with data.

```
npm run seed
```

And lastly, start the application.

```
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).


## Project Instructions

* Install Node modules and get the database setup
  * Run the command npm install to install the required dependencies.
  * Run the command npm run seed to create your application's database and populate it with data.
  * Run the command npm start to run the Node.js Express application.

* Install and Configure Mongoose
  * Use npm to install Mongoose (the module is named mongoose.)
  * Configure Mongoose to use the fsjstd-restapi MongoDB database that you generated when setting up the project.
    * Write a message to the console if there's an error connecting to the database.
    * Write a message to the console once the connection has been successfully opened.

* Create your Mongoose schema and models
  * Your database schema should match the following requirements:
  * User
    * id (ObjectId, auto-generated)
    * firstName (String)
    * lastName (String)
    * emailAddress (String)
    * password (String)

  * Course
    * id (ObjectId, auto-generated)
    * user (id from the users collection)
    * title (String)
    * description (String)
    * estimatedTime (String)
    * materialsNeeded (String)

* Create the course routes
  * Set up the following routes (listed in the format HTTP METHOD Route HTTP Status Code):
    * GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
    * GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
    * POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
    * PUT /api/courses/:id 204 - Updates a course and returns no content
    * DELETE /api/courses/:id 204 - Deletes a course and returns no content

* Update User and Course routes
    * Update the User and Course POST and PUT routes to validate that the request body contains the following required values. Return validation errors when necessary.
    * User
      * firstName
      * lastName
      * emailAddress
      * password
    * Course
      * title
      * description
    * Implement validations within your route handlers or your Mongoose models.
        * Mongoose validation gives you a rich set of tools to validate user data. See http://mongoosejs.com/docs/validation.html for more information.
        * Use the Express next() function in each route handler to pass any Mongoose validation errors to the global error handler.
    * Send validation error(s) with a400 status code to the user.

* Hashing the password
  * Update the POST /api/users route to hash the user's password before persisting the user to the database.
  * For security reasons, we don't want to store user passwords in the database as clear text.
  * Use the bcrypt npm package to hash the user's password.
  * See https://github.com/kelektiv/node.bcrypt.js/ for more information.

* Set up permissions to require users to be signed in
  * Add a middleware function that attempts to get the user credentials from the Authorization header set on the request.
  * You can use the basic-auth npm package to parse the Authorization header into the user's credentials.
    * The user's credentials will contain two values: a name value—the user's email address—and a pass value—the user's password (in clear text).
  * Use the user's email address to attempt to retrieve the user from the database.
  * If a user was found for the provided email address, then check that user's stored hashed password against the clear text password given using bcrypt.
  * If the password comparison succeeds, then set the user on the request so that each following middleware function has access to it.
  * If the password comparison fails, then return a 401 status code to the user.
  * Use this middleware in the following routes:
    * GET /api/users
    * POST /api/courses
    * PUT /api/courses/:id
    * DELETE /api/courses/:id  

* Test the routes

* Debugging help
  * You can edit the nodemon.json file to enable additional logging options for your application.
    * Under the env section in the JSON configuration, set the ENABLE_GLOBAL_ERROR_LOGGING to enable logging of all errors handled by the global error handler.
    * If you change the nodemon configuration while the application is currently running, you'll need to press Ctrl-C to stop the application and re-run the npm start command.

## Extra Credit

* Add additional user email address validations to the POST /api/users route
  * Validate that the provided email address value is in fact a valid email address.
  * Validate that the provided email address isn't already associated with an existing user record.

* Ensure that a user can only edit and delete their own courses
  * Update the PUT /api/courses/:id and DELETE /api/courses/:id routes to check if the course for the provided :id route parameter value is owned by the currently authenticated user.
  * Return a 403 status code if the current user doesn't own the requested course.  

* Course routes
  * When returning a list of courses using the GET /api/courses route or a single course using the GET /api/courses/:id route, use Mongoose deep population to return only the firstName and lastName properties of the related user on the course model. This will hide the user’s private details, like passwords and emails, from other users.
  * Example user object returned: { "_id": "wiubfh3eiu23rh89hcwib", "firstName": "Sam", "lastName": "Smith" } * See the Project Resources section for more information about deep population.
