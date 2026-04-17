import { PermissionedRoute } from '@backstage/plugin-permission-react';
// Keep this comment between imports.
import { Route } from 'react-router-dom';

export const r = (
  <PermissionedRoute path="/docs" permission={docsPermission} element={<DocsPage />} />
);
