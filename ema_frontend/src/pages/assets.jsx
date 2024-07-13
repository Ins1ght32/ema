import { Helmet } from 'react-helmet-async';

import { AssetsView } from 'src/sections/asset/view';

// ----------------------------------------------------------------------

export default function AssetsPage() {
  return (
    <>
      <Helmet>
        <title> Assets | Minimal UI </title>
      </Helmet>

      <AssetsView />
    </>
  );
}
