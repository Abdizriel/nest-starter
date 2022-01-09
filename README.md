<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Nest Starer

A boilerplate for [Nest](https://github.com/nestjs/nest) framework api project

When I start new projects everytime i have to write a starter from the scratch that is why I have created this project to boost work on new things from day 0. You are free to use it however you like.

## Features

- Authentication
  - Login
  - Register
  - Forgot Password
  - Reset Password
- Account Management
  - Get Profile
  - Update Profile
  - Delete Profile
- Feature Toggle
  - List features
- Communication Center
  - Mailing
  - SMS (Twilio)
- Healthcheck
- Internationalization
- Renovate for packages update
- Commitlint for conventional commits

## Prerequisites

- PostgreSQL\*
- Node 14+
- yarn
- Docker\*\*

**Note\*:** Project is database agnostic and can use any database supported by [Prisma](https://www.prisma.io/) as it's used as ORM here.

**Note**:\*\* Database is already set up with Docker

## Getting Started

```bash
# Get the latest version
$ git clone hgit@github.com:Abdizriel/nest-starter.git api

# Start docker
$ docker compose up -d

# Install dependencies
$ yarn

# Start the server
$ yarn start:dev

```

## Contributing

You are welcome to contribute to this project, just open a PR.

## Contact

- Author - [Marcin Mrotek](https://twitter.com/marcinmrotek)

## License

Copyright (c) 2022 Marcin Mrotek

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
