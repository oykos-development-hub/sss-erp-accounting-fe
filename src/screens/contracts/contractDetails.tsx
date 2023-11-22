import {Button, Input, TableHead, Typography} from 'client-library';
import React from 'react';
import FileList from '../../components/fileList/fileList';
import {UserRole} from '../../constants';
import useAppContext from '../../context/useAppContext';
import useContractArticles from '../../services/graphql/contractArticles/hooks/useContractArticles';
import useGetOrderProcurementAvailableArticles from '../../services/graphql/orders/hooks/useGetOrderProcurementAvailableArticles';
import useProcurementContracts from '../../services/graphql/procurementContractsOverview/hooks/useProcurementContracts';
import {ScreenWrapper} from '../../shared/screenWrapper';
import {CustomDivider, Filters, MainTitle, SectionBox, TableContainer} from '../../shared/styles';
import {ContractArticleGet} from '../../types/graphql/contractsArticlesTypes';
import {parseDate} from '../../utils/dateUtils';
import {Column, FormControls, FormFooter, Plan} from './styles';
import { VisibilityType } from '../../types/graphql/publicProcurementArticlesTypes';

export const ContractDetailsSigned: React.FC = () => {
  const {breadcrumbs, navigation, contextMain} = useAppContext();
  const contractID = navigation.location.pathname.split('/').at(-2);
  const {data: contractData} = useProcurementContracts({
    id: contractID,
  });
  const procurementID = contractData?.[0].public_procurement.id;
  const {articles} = useGetOrderProcurementAvailableArticles(procurementID as number, VisibilityType.Accounting);
  const {data: contractArticles, loading: isLoadingContractArticles} = useContractArticles(contractID);
  const role = contextMain?.role_id;

  const tableHeads: TableHead[] = [
    {
      title: 'Opis predmeta nabavke',
      accessor: 'public_procurement_article',
      type: 'custom',
      renderContents: article => {
        return <Typography content={article.title} variant="bodySmall" />;
      },
    },
    {
      title: 'Bitne karakteristike',
      accessor: 'public_procurement_article',
      type: 'custom',
      renderContents: article => <Typography content={article.description} variant="bodySmall" />,
    },
    {
      title: 'Jedinična cijena',
      accessor: 'net_value',
      type: 'custom',
      renderContents: (net_value, row: ContractArticleGet) => (
        <Typography content={`${Number(net_value).toFixed(2)} €`} variant="bodySmall" />
      ),
    },
    {
      title: 'Ukupno neto',
      accessor: 'net_value',
      type: 'custom',
      renderContents: (_, row: ContractArticleGet) => {
        const available = articles.find(article => article.id === row.public_procurement_article.id)?.available || 0;
        const taken = (row.amount || 0) - available;
        const netValue = (row.net_value || 0) * taken;
        return <Typography content={`${Number(netValue).toFixed(2)} €`} variant="bodySmall" />;
      },
    },
    {
      title: 'Ukupno bruto',
      accessor: '',
      type: 'custom',
      renderContents: (_, row: ContractArticleGet) => {
        const available = articles.find(article => article.id === row.public_procurement_article.id)?.available || 0;
        const taken = (row.amount || 0) - available;
        const pdvValue = +(row.net_value || 0 * row.public_procurement_article.vat_percentage) / 100;
        const total = (+(row.net_value || 0) + pdvValue) * taken;
        return <Typography content={`${total?.toFixed(2)} €`} variant="bodySmall" />;
      },
    },
    {
      title: 'Ugovorena količina',
      accessor: 'amount',
      type: 'custom',
      renderContents: (_, row: any) => <Typography content={row?.amount} variant="bodySmall" />,
    },
    {
      title: 'Dostupna količina',
      accessor: '',
      type: 'custom',
      renderContents: (_, row: ContractArticleGet) => {
        return (
          <Typography
            content={articles.find(article => article.id === row.public_procurement_article.id)?.available?.toString()}
            variant="bodySmall"
          />
        );
      },
    },
    {
      title: 'Prekoračenje',
      accessor: 'overage_total',
      type: 'custom',
      renderContents: overage_total => <Typography content={overage_total || 0} variant="bodySmall" />,
    },
    {
      title: '',
      accessor: 'TABLE_ACTIONS',
      type: 'tableActions',
      shouldRender: role !== UserRole.MANAGER_OJ,
    },
  ];

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle
          variant="bodyMedium"
          content={`DETALJI ZAKLJUČENOG UGOVORA:  ${contractData && contractData[0]?.serial_number}`}
          style={{marginBottom: 0}}
        />
        <CustomDivider />
        <Filters style={{marginTop: '1.5rem'}}>
          <Column>
            <Input label={'ŠIFRA UGOVORA:'} disabled={true} value={contractData && contractData[0]?.serial_number} />
          </Column>
          <Column>
            <Input
              label="DATUM ZAKLJUČENJA UGOVORA:"
              value={contractData && parseDate(contractData[0]?.date_of_signing)}
              disabled={true}
            />
          </Column>
          <Column>
            <Input
              label="DATUM ZAVRŠETKA UGOVORA:"
              value={contractData && parseDate(contractData[0]?.date_of_expiry)}
              disabled={true}
            />
          </Column>
          <Column>
            <Input label="DOBAVLJAČ:" value={contractData && contractData[0]?.supplier?.title} disabled={true} />
          </Column>
        </Filters>

        <Filters style={{marginTop: '44px'}}>
          <Column>
            <Input label="UKUPNA NETO VRIJEDNOST" value={contractData && contractData[0]?.net_value} disabled={true} />
          </Column>
          <Column>
            <Input
              label="UKUPNA VRIJEDNOST PDV-A"
              disabled={true}
              value={contractData && contractData[0]?.gross_value}
            />
          </Column>
          <Column>
            <Input
              label="UKUPNA VRIJEDNOST UGOVORA"
              disabled={true}
              value={contractData && contractData[0]?.vat_value}
            />
          </Column>
        </Filters>
        {contractData && contractData[0].file && (
          <Typography variant="bodyMedium" content="Fajlovi:" style={{marginTop: '1.5rem', fontWeight: 600}} />
        )}
        <FileList files={(contractData && contractData[0].file) ?? []} />
        <Plan>
          <Typography content="POSTBUDŽETSKO" variant="bodyMedium" style={{fontWeight: 600}} />
        </Plan>
        <TableContainer
          tableHeads={tableHeads}
          data={(contractArticles as any) || []}
          isLoading={isLoadingContractArticles}
        />
      </SectionBox>
      <FormFooter>
        <FormControls>
          <Button
            content="Nazad"
            variant="secondary"
            onClick={() => {
              navigation.navigate(-1);
              breadcrumbs.remove();
            }}
          />
        </FormControls>
      </FormFooter>
    </ScreenWrapper>
  );
};
