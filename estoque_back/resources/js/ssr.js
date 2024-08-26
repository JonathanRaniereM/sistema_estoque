import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';
import ssrPrepass from 'react-ssr-prepass';

export default async function handleSSR(url) {
  const context = {};
  const app = (
    <StaticRouter location={url} context={context}>
      <App />
    </StaticRouter>
  );


  await ssrPrepass(app);

  const appHtml = ReactDOMServer.renderToString(app);

  return { appHtml, context };
}
