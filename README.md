# NodeJS secure RESTFUL api

A minimal, secure RESTFUL api for NodeJS. This project includes user login, access control of objects, and encrypted hashing of passwords right out of the box!

# Installation

- Clone the repo by using `git clone`.
- Run `npm install` on the cloned directory.
- Edit the environment variables to suit your needs.
- Add APIs using the instructions below to suit your needs.

# Steps to add new API

- Copy the template model (models) to a new file in the **models** folder and make the modifications outlined in the header.

`copy models/User.js --> models/Custom.js`

- Copy the template routes (Routes/User.js) to a new file in the **Routes** folder and make the modifications outlined in the header.

`copy Routes/User.js --> Routes/User.js`

- Add the routing line to app.js underneath the existing routes, like so:

```
app.use('/users', User);
app.use('/custom', Custom);
```

# Running the software

- `node app.js` for simple setups.
- I would recommend looking at [the pm2 module](https://www.npmjs.com/package/pm2) for running on a production server.

# Creating users

To create users, simply send a POST to /user with the required fields in the query string, like so:

```
http://localhost:3000/users/
```

# API Endpoints

```
POST http://localhost:3000/users // creates object with fields foo=hello, bar=world
GET http://localhost:3000/users/login
GET http://localhost:3000/me // gets object with token
GET http://localhost:3000/me/avatar // get profile pic
GET http://localhost:3000/logout // deletes object
DELETE http://localhost:3000/me // deletes object
PATCH http://localhost:3000/me // update object
```
