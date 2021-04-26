# Node.js Basics

### Creating A sinple http server

```js
const http = require('http'); // Requseting the http liberary.

// Creating The server via createServer method.
const server = http.createServer((req, res) => {
	// This code will run everytime a request is made.
	// The request and responce are handled here.
});

// Starting the Server
server.listen(3000);
```

- The createServer method will take a callback function which will run everytime a request is made to the serve.

- It will return the server object which will conntain all the method releated to the server.

- The callback function will take two arguments, the request and the responce.

- The request will contain all kind of information about the client. Some important data are url, headers, method.

- The respose will need to be filled with the responce that we wnated. See Code Snippet below to see.

```js
// Need to be inside the createServe callback function.

// Setting the headers,
res.setHeader('Content-Type', 'text/html');

// Setting the main content.
res.write('<html>');
res.write('<head><title>Yo Guys!!!</title></head>');
res.write('<body><h1>Hello, there</h1></body>');
res.write('</html>');

//End of the editing; No changes should be done after that!!
res.end();
```

## Working with Data

When the user enter the data it will come to the server as a stream. TO work with these stream we need to use buffer.

The incomming data is part of the request object.

_Note:_ The buffer will store the steam of data untill its used.

```js
// Whever the stream of data send do this,
req.on('data', chunk => {
	// Do somthing with incomming data.
});

// After the data is fully received do this.
req.on('end', () => {
	// After the data is fully recived do this.
});
```

## Working with multiple files

If we have multiple files, and we want to include them we can simpley use the `required` method for that.

But when we define the constant for the module, we need to export the functions or anything form that file to the main file.

For that we will use the following syntax

```js
// For exporting a single thing.
module.exports = 'somthing';

// For exporting multiple things
module.exports = {
	// Some key value pair
};

// OR

exports.key = value;
// exports.key = value;
// exports.key = value;
// exports.key = value;
```
