import {Button, Input, Table, Typography} from 'client-library';
import FileList from '../../components/fileList/fileList';
import useAppContext from '../../context/useAppContext';
import useGetMovementDetails from '../../services/graphql/movement/hooks/useGetMovementDetails';
import ScreenWrapper from '../../shared/screenWrapper';
import {tableHeadsStockArticleDetails} from './constants';
import {CustomDivider, FormControls, FormFooter, Header, InputWrapper, MainTitle, SectionBox} from './styles';

const MovementDetails = () => {
  const {navigation, breadcrumbs} = useAppContext();
  const movementID = navigation.location.pathname.split('/').at(-2);
  const {movementDetailsItems} = useGetMovementDetails(movementID);
  const receiveFile = movementDetailsItems?.file;

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle content="OTPREMNICA" variant="bodyMedium" />
        <CustomDivider />
        <Header>
          {receiveFile?.id !== 0 && (
            <div>
              <Typography variant="bodySmall" style={{fontWeight: 600}} content={'OTPREMNICA:'} />
              <FileList files={(receiveFile && [receiveFile]) ?? []} />
            </div>
          )}
          <InputWrapper>
            <div>
              <Input
                label="KANCELARIJA:"
                value={movementDetailsItems?.office.title}
                disabled
                style={{width: '250px'}}
              />
            </div>
            <div>
              <Input
                label="PRIMALAC:"
                value={movementDetailsItems?.recipient_user.title}
                disabled
                style={{width: '250px'}}
              />
            </div>
          </InputWrapper>
        </Header>
        <Table tableHeads={tableHeadsStockArticleDetails} data={movementDetailsItems?.articles || []} />
        <FormFooter>
          <FormControls>
            <Button
              content="Nazad"
              variant="secondary"
              onClick={() => {
                navigation.navigate('/accounting/movement');
                breadcrumbs.remove();
              }}
            />
          </FormControls>
        </FormFooter>
      </SectionBox>
    </ScreenWrapper>
  );
};

export default MovementDetails;
