# KiguDB

Project repository for KiguDB

## Pre-requisite

1. [Installation of Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-installer-to-install-nodejs-and-npm)

## Getting Started

#### Setting Up Database

In root folder, create a file name `.env`.

Inside the `.env` file, you will setup your database connection string.
The string connects to a PosgreSQL database.

```
# Example URL
DATABASE_URL=postgres://postgres.[YOUR-DATABASE-NAME]:[YOUR-PASSWORD]@foo.bar.com:6543/postgres
```

Contact project owner for the `DATABASE_URL` of current dev SQL server.

## Run Project Locally

Check if Node.js and NPM are installed and configured. Run these commands in Terminal:

```
node -v
npm -v
```

In terminal, run the following command:

#### Windows

```
npm install
npm run dev
```

If suceeded, the terminal will show that you can access the local website at `http://localhost:xxxx`. Use that link in the browser.

Happy building!
