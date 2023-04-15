const fetch = require('node-fetch');
const express = require('express');

const app = express();
const port = 8080;

app.get('*', async (req, res, next) => {
  const url = req.originalUrl;
  const httpsUrl = url.replace(/^http:\/\//,'https://')
  console.log('request:',httpsUrl);
  const upstream = await fetch(httpsUrl);
  const contentType = upstream.headers.get('content-type');
  if(contentType.startsWith('text/html')) {
    res.set('Content-Type','text/html');
    res.status(upstream.status);
    res.send((await upstream.text()).replace(/https:\/\//g,'http://'));
  } else {
    res.set('Content-Type',contentType);
    res.status(upstream.status);
    res.send(await upstream.buffer());
  }
});

app.listen(port);
console.log(`Listening on port ${port}`);
