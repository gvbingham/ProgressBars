# ProgressBars
Progress bars for tracking whatever you want.

#Installation
So long as your web server is configured to serve up the public folder then this should work out of the box.

I have created a server.js file to be run by node that can be used as a webserver. Currently it is set to serve up at http://localhost:3000 If you need directions on installation of nodejs see https://nodejs.org/
```node server.js```
If you want to have the server running indefinately then I suggest the usage of PM2 https://github.com/Unitech/pm2
If you want to change the port to 80 for normal web browsing adjust the server.js file
```javascript
app.listen(80);
```

If you want to use the mocha test suite with the application then simply run ```npm install``` in the root of the application directory. The test suite can be accessed by navigating to /test/test.html from wherever it is being served up. **Some tests are failing**

