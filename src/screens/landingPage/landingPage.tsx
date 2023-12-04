import {Typography, BoxIcon, TextIcon, ContractIcon, ReportIcon} from 'client-library';
import React from 'react';
import useAppContext from '../../context/useAppContext';
import {Container, ContentBox, IconWrapper, LandingPageTitle, Title, TitleWrapper} from './styles';
import ScreenWrapper from '../../shared/screenWrapper';

export const LandingPage: React.FC = () => {
  const {
    navigation: {navigate},
    breadcrumbs,
  } = useAppContext();

  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="MATERIJALNO KNJIGOVODSTVO" />
        </LandingPageTitle>
        <Container>
          <ContentBox
            onClick={() => {
              navigate('/accounting/order-form');
              breadcrumbs.add({name: 'Narudžbenica', path: '/accounting/order-form'});
            }}>
            <TitleWrapper>
              <Title variant="bodyLarge" content="Narudžbenica" />
            </TitleWrapper>
            <IconWrapper>
              <BoxIcon />
            </IconWrapper>
          </ContentBox>
          <ContentBox
            onClick={() => {
              navigate('/accounting/contracts');
              breadcrumbs.add({name: 'Ugovori', path: '/accounting/contracts'});
            }}>
            <TitleWrapper>
              <Title variant="bodyLarge" content="Ugovori" />
            </TitleWrapper>
            <IconWrapper>
              <ContractIcon />
            </IconWrapper>
          </ContentBox>
          <ContentBox
            onClick={() => {
              navigate('/accounting/stock');
              breadcrumbs.add({name: 'Zalihe robe', path: '/accounting/stock'});
            }}>
            <TitleWrapper>
              <Title variant="bodyLarge" content="Zalihe robe" />
            </TitleWrapper>
            <IconWrapper>
              <TextIcon />
            </IconWrapper>
          </ContentBox>
          <ContentBox
            onClick={() => {
              navigate('/accounting/reports');
              breadcrumbs.add({name: 'Izvještaji', path: '/accounting/reports'});
            }}>
            <TitleWrapper>
              <Title variant="bodyLarge" content="Izvještaji" />
            </TitleWrapper>
            <IconWrapper>
              <ReportIcon />
            </IconWrapper>
          </ContentBox>
        </Container>
      </div>
    </ScreenWrapper>
  );
};
