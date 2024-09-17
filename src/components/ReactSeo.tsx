import { Helmet } from 'react-helmet';

export interface ReactSeoProps {
  title?: string;
  isShowDefault?: boolean;
}

export default function ReactSeo(params: ReactSeoProps) {
  const { title = '', isShowDefault = true } = params;

  return (
    <Helmet>
      <title>{`${isShowDefault ? 'Recovery AA Wallet | ' : ''}${title}`}</title>
    </Helmet>
  );
}
