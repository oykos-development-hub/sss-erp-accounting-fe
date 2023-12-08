import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useEffect, useMemo, useState} from 'react';
import useAppContext from '../../context/useAppContext';
import ScreenWrapper from '../../shared/screenWrapper';
import {Tabs, getCurrentTab, getRouteName, stockTabs} from './constants';
import {MovementList} from './movementList';
import {StockReview} from './stockReview';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from './styles';

export const StockScreen = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
  } = useAppContext();
  const [activeTab, setActiveTab] = useState(getCurrentTab(location.pathname) || 1);
  const stockPath = pathname && pathname.split('/')[pathname.split('/').length - 1];

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
    const routeName = getRouteName(tab.title as string);

    const pathname = location.pathname.split('/');
    pathname.pop();

    navigate(`${pathname.join('/')}/${routeName}`);
  };

  const stockRoute = useMemo(() => {
    switch (stockPath) {
      case 'movement':
        return <MovementList />;
      default:
        return <StockReview />;
    }
  }, [stockPath]);

  const getTitle = () => {
    switch (activeTab) {
      case Tabs.Stock:
        return 'PREGLED';
      case Tabs.AssetMovement:
        return 'LISTA SVIH OTPREMNICA';

      default:
        throw new Error(`Tab ${activeTab} does not exist`);
    }
  };
  useEffect(() => {
    setActiveTab(getCurrentTab(location.pathname) || 1);
  }, [location.pathname]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <TitleTabsWrapper>
          <MainTitle variant="bodyMedium" content={getTitle()} style={{marginBottom: 0}} />
          <StyledTabs tabs={stockTabs} activeTab={activeTab} onChange={onTabChange} />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />
        {stockRoute}
      </SectionBox>
    </ScreenWrapper>
  );
};
