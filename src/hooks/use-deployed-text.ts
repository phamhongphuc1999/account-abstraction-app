import { useMemo } from 'react';
import { useAppSelector } from 'src/redux-slices/store';

export default function useDeployedText() {
  const { deployType } = useAppSelector((state) => state.user);

  const deployText = useMemo(() => {
    // eslint-disable-next-line quotes
    if (deployType == 'notDeploy') return "haven't deployed";
    else if (deployType == 'deployed') return 'deployed';
    else return '';
  }, [deployType]);

  return { deployText };
}
