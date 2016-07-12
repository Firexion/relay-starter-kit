import Koa from 'koa';
import parser from 'koa-bodyparser';
import mount from 'koa-mount'
import serve from 'koa-static'
import proxy from 'koa-proxy'
import { koa } from '@risingstack/graffiti';
import { getSchema } from '@risingstack/graffiti-mongoose';
import mongoose from 'mongoose';
import {Models} from './data/schema';

const APP_PORT = 3000;
const MONGO_PORT = 27017;
const GRAPHQL_PORT = 5000;

// Connect to the db
mongoose.connect('mongodb://localhost:${MONGO_PORT}/graffiti-test');

const hooks = {
  viewer: {
    pre: (next, root, args, request) => {
      console.log(request);
      next();
    },
    post: (next, value) => {
      console.log(value);
      next();
    }
  }
};

const schema = getSchema(Models, {hooks});

// Expose a GraphQL endpoint
const graphQLServer = new Koa();
graphQLServer.use(parser());

// attach graffiti-mongoose middleware
graphQLServer.use(koa({
  schema
}));

// redirect all requests to /graphql
graphQLServer.use(function *redirect() {
  this.redirect('/graphql');
});

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));



// Serve static resources
const app = new Koa();

app.use(mount('/graphql', proxy({
  url: `http://localhost:${GRAPHQL_PORT}/graphql`
})));

app.use(serve(__dirname + '/public'));

app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});




