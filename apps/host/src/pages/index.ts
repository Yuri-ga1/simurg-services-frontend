import { createBrowserRouter } from 'react-router-dom';
import { createElement } from 'react';
import { BaseLayout } from '../layouts/base';
import { IndexPage } from './index/index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: createElement(BaseLayout),
    children: [
      {
        index: true,
        element: createElement(IndexPage),
      },
    ],
  },
]);
