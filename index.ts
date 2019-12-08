import express from 'express';
import bodyParser from 'body-parser';

import { testRequest } from './requestPuppeteerRunner';


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', testRequest);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Server Started");
});
