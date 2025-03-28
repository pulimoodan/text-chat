
# Live Text Chat

A document editor like text chat where users can handle the same cursor


## Tech Stack

**Client:** HTML, CSS, JS

**Server:** Node, Express


## Features

- Private sessions with keys
- Live typing updates
- Restore sessions
- Save sessions when all users disconnect


## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file

`PORT`


## Run Locally

Clone the project

```bash
  git clone https://github.com/pulimoodan/text-chat.git
```

Go to the project directory

```bash
  cd text-chat
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Usage/Examples

Just open the app with any secret keys after the `/`

https://example.com/my-secret-key

This will create a new session.

If we open the root URL, it will get redirected to a new random session key


## Production

```bash
 npm run start
```
## Authors

- [Akbar Ali](https://www.github.com/pulimoodan)


