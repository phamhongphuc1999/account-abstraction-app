import ImportToken from 'src/pages-view/home/import-token';
import TokenList from 'src/pages-view/home/token-list';

export default function Home() {
  return (
    <>
      <TokenList />
      <ImportToken props={{ sx: { mt: 1 } }} />
    </>
  );
}
