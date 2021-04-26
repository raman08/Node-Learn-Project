# Express.js

#### Installing express.js

We need to install the Express as our production dependency.

```
npm install --save express
```

## Using Express.js

- After installing the express.js we need to import the express to our project and then run the server with it.

```js
const express = require('express'); // Importing express

// Creating a new express app.
const app = express();

// Creating the server using the express app.
app.listen(3000);
```

- This is just a way to create a basic http server using the exprees.js.

## Using the middleware

The express.js is basically a middleware where is recieve a request and then pass the request to the another function and so on untill it send back the responce.

```js
// After declearing the express app and before starting the sever we need to define the logic for our app

// Using the express middleware.

app.use(
	//A function with three parameters-:
	(request, respnce, next) => {
		// The logic
	}
);
```

- The request and responce are same as before.
- The next is a function which will call the next middleware when its called.
- In express, we will be travelling from one middleware to the next untill we send the responce.

### Sending the responce

```js
res
	.send
	//Anything to send
	();
```

- The expressjs will automatically set the header for the responce you send or we can manually overrite this.

### Handeling the different routes

- The use method of the express app have an optional argument of routes which will match the path in the url and handle the respoce according to it.

- _Remember:_ The app will handle the middleware in the order in which it is written.

```js
app.use('/route/path', callback_function);
```

### Parsing the Incomming the Request

- To parse the incomming request we need to have a parser. For the simple body parsing we will use the package called `body-parse`

**Installing _body-parser_**

```
npm install --save body-parser
```

After installing the required dependies we will add the parser to the express app

```js
const bodyParser = required('body-parser');

app.use(bodyParser.urlencoded());

app.post('/product', (req, res, next) => {
	console.log(req.body);
	res.redirect('/');
});
```

- `req.body` is a special method added by express which contain the body of the request.

- The `post` method all us to send the request only for the post request. Similary there is `get` method for handeling only the get request.

### Seprating the ROUTES

- It is always the good practice to seprate the routes for the app.

- The default way fo doing this is to create a directory called Routes and then add all the routes requests to this.

- The express give us a easier method to handle our requests.

```js
const express = require('express');

// Using Routes to handle aur routes.
const router = express.Router();

router
	.get
	// handler for our request method.
	();

/* Example

* router.post('/product', (req, res, next) => {
* console.log(req.body);
* res.redirect('/');
  });

*/

module.exports = router;
```

### Adding 404 page.

- To add 404-page after the end of all middleware just add the following code

```js
// Adding the 404 page
app.use((req, res, next) => {
	res.status(404).send('<h1>404-Page Not Found</h1>');
});
```

### Adding Custom HTML Pages

- In general case the html files are added in the views folder.

- We will use the `sendFile` method of the responce object for sending static html files.

```js
const path = require('path');

app.method('/end/point', (req, res, next) => {
	// Sending the responce
	res.sendFile(
		path.join(path.dirname(process.mainModule.filename), 'path_to_the_file')
	);
});
```

- `__dirname` will give the current directory in which the file is located.

- The `join` method will join the path given in the arguments in the os formate.

_Note:_ We can use `process.mainModule.filename` to get the main file which started the prrocess/server and then find its path via `path.dirname()` method. This will give us the root folder of the project.

### Serving Static Files

- All static files should be in public folder.

- To acess public folder add the following in the main application file.

```js
app.use(express.static(path.join(__dirname, 'public')));
```

- The `express.static` will mark the folder given in argument as public and can be easily asscelible by the users.
