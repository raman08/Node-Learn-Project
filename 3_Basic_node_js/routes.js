const fs = require('fs');

const requestHandler = (req, res) => {

	const url = req.url;
	const method = req.method;

	if(url === '/'){
		res.setHeader('Content-Type', 'text/html');
		res.write('<html>');
		res.write('<head><title>Home</title></head>');
		res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Submit</button></form></body>');
		return res.write('</html>');
	}

	if(url === '/message' && method === 'POST') {

		const body = [];

		// Whever the stream of data is comming do this,
		req.on('data', (chunk) => {
			console.log(chunk);
			body.push(chunk);
		});

		// After the data is fully received do this.
		return req.on('end', () => {
			const parsedBody = Buffer.concat(body).toString();
			const message = parsedBody.split('=')[1];

			fs.writeFile('message.text', message, (err) => {
				res.statusCode = 302;
				res.setHeader('Location', '/');
				return res.end();
			});
		});
	}

	res.setHeader('Content-Type', 'text/html');
	res.write('<html>');
	res.write('<head><title>Yo Guys!!!</title></head>');
	res.write('<body><h1>Hello, there</h1></body>');
	res.write('</html>');

	res.end(); //End of the editing;
};

module.exports = requestHandler;