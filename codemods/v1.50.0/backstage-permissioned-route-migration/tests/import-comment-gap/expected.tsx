import { RequirePermission } from '@backstage/plugin-permission-react';
// Keep this comment between imports.
import { Route } from 'react-router-dom';

export const r = (
  <Route path="/docs" element={<RequirePermission permission={docsPermission}><DocsPage /></RequirePermission>} />
);
