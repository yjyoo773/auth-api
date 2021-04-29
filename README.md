# LAB - Basic Auth


### Author: Ellis Yoo

### Links and Resources

- [ci/cd](https://github.com/yjyoo773/auth-api/actions)
- [back-end server url](https://ellis-auth-api.herokuapp.com/)

### Setup
#### How to initialize/run your application (where applicable)
- Dependencies
  - dotenv
  - bcrypt
  - base-64
  - cors
  - mongoose
  - express
  - jest
  - fs
  - morgan
  - jsonwebtoken
  - supergoose
- Application is initialized by `npm start`
- Application can run using nodemon by `npm run watch`


#### Tests

- How do you run tests?   
The tests can be run by entering `npm test` or `npm run test-watch` on the command line.  
- Any tests of note?  
Each test runs testing the V1 route and V2 which are similar except that the V2 route is secured needing the proper `role` and `token` to be accessed.

![](/img/uml.jpeg)