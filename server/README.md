## Boards
Full-stack boards/threads web application built with Javascript. Includes:

* Creating a new Board
* Adding people to Boards
* Creating threads within board
* Comment on a thread
* Mark thread as sticky/locked
* Upvote/downvote a comment

### Back-End

API is built with Node.js (Express), and is used for fetching and storing all the data used by the front-end. Data is stored in a MongoDB database. Passport is used for JWT authentication for user auth and token is sent with every request to the API. Request will fail if the JWT token is missing.

Used libraries:
* **Node.js** for the server
* **Express** for routing
* **Passport** for authentication
* **Winston** for general logging
* **Morgan** for access logging
* **MongoDB** for data storing
* **Mongoose** for ODM

### Front-End

Front end is built using React with React Hooks, with Redux to decouple business logic from the UI. Styled-Components is used for encapsulation of styles within components themselves.

Used libraries:
* **React** for UI
* **Redux** for state management
* **Styled-Components** for styling
