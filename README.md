# Go/

Go is an internal custom URL creator/redirector.
It allows you to make personal and memorable short URLs for longer, immemorable, crappy ones.

You can (soon) find the live version at [go/](http://go/).


## Usage

### Prerequisites

You must have MongoDB installed. Use Homebrew to install it.

### Installing and Running

- Clone this repository.
- Run `./scripts/setup.sh` to install all dependencies.
- Run `mongod` to start the database.
 - Optionally populate your database with `./scripts/populateDb.js`
- Run `npm start` to run the app.
 - Optionally run `node-inspector` to start the debugger.
- Open `http://localhost:3000/` in your browser.


## Contributing

Yes, please.

- Make your own branch
- Do epic stuff.
- Run `grunt` to validate.


## Authors

- Allard van Helbergen (allard@)
