import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactSeo from 'src/components/ReactSeo';
import { HARDCODE_PASSWORD } from 'src/configs/constance';
import { SignatureScheme } from 'src/global';
import useRecoverHashWallet from 'src/hooks/use-recover-hash-wallet';
import CurveDashboard from 'src/pages-view/curve-page/curve-dashboard';
import CurveSignature from 'src/pages-view/curve-page/curve-signature';
import { useHashKeyring } from 'src/wallet-connection/hash-system-wallet/hash-wallet-context';

export default function CurvePage() {
  const navigate = useNavigate();
  const { schema: urlSchema } = useParams();
  const { recoverFn } = useRecoverHashWallet();
  const [schema, setSchema] = useState<SignatureScheme>(urlSchema == 'ecdsa' ? 'ecdsa' : 'ed25519');
  const { keyring, metadata } = useHashKeyring(schema);

  function onSchemaChange() {
    setSchema((preValue) => {
      const newValue = preValue == 'ecdsa' ? 'ed25519' : 'ecdsa';
      navigate(`/curve-page/${newValue}`);
      return newValue;
    });
  }

  useEffect(() => {
    if (!keyring) recoverFn(schema, HARDCODE_PASSWORD);
  }, [keyring, recoverFn, schema]);

  return (
    <>
      <ReactSeo title="Curve" />
      <Button variant="outlined" onClick={onSchemaChange}>
        {schema}
      </Button>
      {keyring && metadata && (
        <>
          <CurveDashboard keyring={keyring} metadata={metadata} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CurveSignature keyring={keyring} />
          </Box>
        </>
      )}
    </>
  );
}
