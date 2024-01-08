import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import useNotifications from '@/store/notifications';
import { Button } from '@mui/material';

function Page1() {
  const [, actions] = useNotifications();
  function showNotification() {
    actions.push({ message: 'Բարև, կարմի՛ր արև' });
  }
  return (
    <>
      <Button onClick={showNotification} color="info">
        {'hola'}
      </Button>
      <Meta title="page 1" />

      <FullSizeCenteredFlexBox>
        <Typography variant="h3">Page 1</Typography>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default Page1;
