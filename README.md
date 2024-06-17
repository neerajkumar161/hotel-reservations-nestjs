<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Hotel Reservation System

This project is a Hotel Reservation System API built using NestJS, GraphQL, and Mongoose. It provides functionality for managing hotel reservations, including creating, retrieving, and cancelling reservations. It also supports JWT-based authentication and error handling.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```

## Features

- JWT-based authentication
- CRUD operations for reservations
- Pagination and filtering
- DataLoader for efficient data fetching
- GraphQL API
- Error handling and validation

## Requirements

- Node.js (version 14 or higher)
- MongoDB

## Enviroment Variables
Create a .env file and configure the following variables
 - MONGO_URI=<Your MongoDB URI>
 - JWT_SECRET=<Your JWT Secret>

## Documentation
To check complete documentation of the GraphQL endpoints visit [API Reference](https://hotel-reservations-nestjs.vercel.app/api-reference)

## Test Example
To get all reservations of the user, you need to follow these steps
 - Sign up using query signup
 - Sign in and get token to access all protected queries and mutation
 - Pass the Authentication token in headers as { Authorization: Bearer <YOUR_TOKEN>}
 - Use variables that need to pass to the query.
 - Below is the example. 
  ```ts
  query SignIn($userInput: LoginUserDto!) {
    signIn(userInput: $userInput) {
      accessToken
    }
  }
  // Variables
  {
    userInput: { "email": "test@test.com", "password": "tester" }
  }
  // Headers
  { Authorization: Bearer <accessToken> }
  ```
 ```ts
 
 query GetReservations($paginationDto: PaginationDto!) {
    getReservations(paginationDto: $paginationDto) {
      edges {
        cursor
        node {
          ...ReservationEntityFragment
        }
      }
      nextCursor
    }
  }

  // Sample Response
  {
    data: {
      getReservations: {
        nextCursor: '666da4096b3835179380424d',
        edges: [
          {
            cursor: '666da4096b3835179380424d',
            node: {
              arrivalDate: '2024-06-17T13:55:09.491Z',
              departureDate: '2024-06-18T13:55:09.491Z',
              _id: '666da4096b3835179380424d',
              hotelId: {
                name: 'LXR Hotels and Resort'
              },
              userId: {
                name: 'Test User',
                _id: '666c7c6d7b31da3ccdeb7036'
              },
              amount: 8000,
              status: 'active'
            }
          }
        ]
      }
    }
  };
 ```
## Deployment
To run complete application here is the [CodeSanbox](https://codesandbox.io/p/github/neerajkumar161/hotel-reservations-nestjs/main?import=true&layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clxjahjhg00063b6tsg0zlk44%2522%252C%2522sizes%2522%253A%255Bnull%252Cnull%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clxjahjhg00023b6t2qfiyyss%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clxjahjhg00043b6tbj3jkpwx%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clxjahjhg00053b6tivcmyppf%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B40.95098115316364%252C59.04901884683636%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clxjahjhg00023b6t2qfiyyss%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clxjahjhg00013b6t161mylsm%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252FREADME.md%2522%252C%2522state%2522%253A%2522IDLE%2522%257D%255D%252C%2522id%2522%253A%2522clxjahjhg00023b6t2qfiyyss%2522%252C%2522activeTabId%2522%253A%2522clxjahjhg00013b6t161mylsm%2522%257D%252C%2522clxjahjhg00053b6tivcmyppf%2522%253A%257B%2522id%2522%253A%2522clxjahjhg00053b6tivcmyppf%2522%252C%2522tabs%2522%253A%255B%255D%257D%252C%2522clxjahjhg00043b6tbj3jkpwx%2522%253A%257B%2522id%2522%253A%2522clxjahjhg00043b6tbj3jkpwx%2522%252C%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clxjahjhg00033b6t9hvsvcvj%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TERMINAL%2522%252C%2522shellId%2522%253A%2522clxjahk2n0037dbgjceij7fee%2522%257D%255D%252C%2522activeTabId%2522%253A%2522clxjahjhg00033b6t9hvsvcvj%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A19.69576719576719%257D) URL
## Error Handling
Errors are handled using a custom GraphQL exception filter. Errors are serialized in a consistent format for better readability.

## Testing
To run the unit tests, use the following command:
```bash
$ npm run test
```

## Support
Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
