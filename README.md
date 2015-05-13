# Go/

Go is an internal custom URL creator/redirector.
It allows you to make personal and memorable short URLs for longer, immemorable, crappy ones.

You can (soon) find the live version at [go/](http://go/).


## Development

### Prerequisites

You must have MongoDB installed. Use Homebrew to install it.

### Installing and Running

- Clone this repository.
- Copy an environment template file from `envTemplates/` to `.env` e.g. `cp envTemplates/development .env`.
- Set up the OAuth
    - Head to [Google's Developer Console](http://console.developers.google.com/)
    - Create a project called "Go URL Shortener" (or whatever)
    - Go to: API & Auth > Credentials
    - Click "Create new Client ID"
    - Fill in the details, using:
        - Redirect URIs: `http://localhost/_auth/google/callback`
        - Javascript Origins: `http://localhost`
    - Copy the Client ID and Secret to the Passport entries in your `.env` file.
- Run `npm start` to start everything. This will run:
 - `./scripts/setup.sh` to install all dependencies,
 - `mongod` to start the local db,
 - `nodemon . --debug` to start the app with debugger support.
- Optionally, while the app is running:
 - populate your database with `./scripts/populateDb.js`,
 - run `node-inspector` (in a separate terminal window) to start the debugger.
- Open `http://localhost:3000/` in your browser.


## Deployment

### Prerequisites

Get your Github public key on Lightning. File a ticket with systems for this.

### Deploying New Version to Production

- Log into the prod server with `ssh brandwatch@lightning`.
- Run the deploy script from the app dir on the master branch with `./scripts/deploy.sh`.
 - If it for any reason isn't running, start it with `npm run prod`.
 - Validate that it's running with `forever list`.

### Notes on Maintenance of Production

#### Connecting to MongoDB with RoboMongo

[RoboMongo](http://robomongo.org/) currently has
[a bug](https://github.com/paralect/robomongo/issues/484)
making it unable to connect through ssh.
A [comment](https://github.com/paralect/robomongo/issues/484#issuecomment-47926092)
on the bug issue proposes the following workaround.

- Set up a tunnel from a target port to a local port, by running `ssh brandwatch@lightning -L 27018:127.0.0.1:27017`
- In RoboMongo create the connection to with the corresponding settings.
  - Host: `127.0.0.1` (your localhost)
  - Port: `27018` (your local port)


## Contributing

Yes, please.

- Fork this repo.
- Make your own feature branch.
- Do mind blowing stuff.
- Run `grunt` to validate.
- Submit a PR to epic for the win.


## Authors

- Allard van Helbergen (allard@)
