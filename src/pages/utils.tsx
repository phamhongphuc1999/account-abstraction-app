import { Box } from '@mui/material';
import { CssDivide } from 'src/components/utils';
import useRecoverBabyJubjubAccount from 'src/hooks/use-recover-baby-jubjub-account';
import GeneratePoseidonHash from 'src/pages-view/utils/generate-poseidon-hash';
import GenerateWitness from 'src/pages-view/utils/generate-witness';

export default function Utils() {
  useRecoverBabyJubjubAccount();

  return (
    <Box>
      <GenerateWitness />
      <CssDivide sx={{ my: 2 }} />
      <GeneratePoseidonHash />
    </Box>
  );
}
