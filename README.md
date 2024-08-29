![Logo](https://raw.githubusercontent.com/tanushchauhan/grade-app/main/public/grademate_logo.png)

# GradeMate

This is a grade app that I made as a wrapper of the Home Access Center of Frisco ISD. This has a better UI and more features compared to HAC.

## Run Locally

If you want you can run the application locally

Clone the project

```bash
  git clone https://github.com/tanushchauhan/grade-app.git
```

Go to the project directory

```bash
  cd grade-app
```

Install dependencies

```bash
  npm install
```

Build the project

```bash
  npm run build
```

Start the server

```bash
  npm start
```

## Authors

- [@tanushchauhan](https://www.github.com/tanushchauhan)

## Demo

You can go to the [here](https://grademate.tanushchauhan.com/) and login with the demo account using the credentials on the login page in order to experience the application.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PUBKEY`

`PRIKEY`

They should be a public and private key pair which you can generate using the node-rsa module. This is used to encrypt the credientials between client and the server and generate a special token for each user.

## Credit

I have used an open-sourced template to start off the UI of this application. The template can be found [here](https://github.com/NextJSTemplates/startup-nextjs).
