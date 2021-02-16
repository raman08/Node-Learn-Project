# Handeling Dynamic Data and Templates Engine


## Using Template Engine

Using Express it is very Easy to add an template engine to our project.

We simplly need to change the globle configuration setting of Express.

After Creating the express app add the following code.

```js
// view engine define the engien to use for rendering HTML.
app.set('view engine', {{ name }});

// view is the location of the templates. The default is root+/views
app.set('views', {{ location of engine }});
```
### Using PUG Template Engine

- First install the pug engine

```
npm install --save pug
```

- Add the following code after the creation of express app.

```js
app.set('view engine', 'pug');
app.set('views', 'views');
```

- To render the pug file add the following in apporiate place

```js
res.render('{{ location }}')
```