# Introduction

This file list some of the important steps to be taken when performing common operations.

## Adding a New Endpoint

#### Create Tests

* Create dummy tests for the endpoint so we can meet the requirements of test-driven development (TDD).
* Remember to add JsDoc to the test file.

#### Create Routes

* Create and export routes from a file in *routes*
* Import the routes into *routes/index.js*, and expose them to the app
* Run tests
* Remember to add API doc to routes.

#### Create Controllers

* Upgrade tests to reflect the expected realities from the actual implementation of the endpoints.
* Create and export controller `class` from a file in *controllers/*
* Import the controller into *controllers/index.js*, and export it from there.
* Run tests.
* Remember to add JsDoc to the controller file, and update the one in the test file.

#### Create/Add Middleware

* Upgrade tests to reflect the expected realities from the actual implementation of the middleware to be introduced.
* Create and export middle from *middleware/*
* Import middleware into *middleware/index.js*, and export middleware from there.
* Add middleware to endpoints.
* Run tests.
* Remember to add JsDoc to middleware.

* *talk about creating and testing models*