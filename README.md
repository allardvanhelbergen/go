# Go/

Go is an internal custom URL creator/redirector.
It allows you to make personal and memorable short URLs for longer, immemorable, crappy ones.

You can (soon) find the live version at [go/](http://go/).


## Usage

### Prerequisites

You must have MongoDB installed. Use Homebrew to install it.

### Installing and Running

- Clone this repository.
- Copy an environment template from `envTemplates/` to `.env`.
- Run `npm start` to start everything. This will run:
 - `./scripts/setup.sh` to install all dependencies,
 - `mongod` to start the local db,
 - `nodemon . --debug` to start the app with debugger support.
- Optionally, while the app is running:
 - populate your database with `./scripts/populateDb.js`,
 - run `node-inspector` (in a separate terminal window) to start the debugger.
- Open `http://localhost:3000/` in your browser.


## Contributing

Yes, please.

- Make your own branch
- Do epic stuff.
- Run `grunt` to validate.


## Authors

- Allard van Helbergen (allard@)
