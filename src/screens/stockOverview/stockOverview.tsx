import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {useState} from 'react';
import useAppContext from '../../context/useAppContext';
import {ScreenWrapper} from '../../shared/screenWrapper';
import {MovementList} from './movementList';
import {StockReview} from './stockReview';
import {CustomDivider, MainTitle, SectionBox, StyledTabs, TitleTabsWrapper} from './styles';

enum Tabs {
  Stock = 1,
  AssetMovement = 2,
}

export const StockScreen = () => {
  const {navigation} = useAppContext();
  const location = navigation?.location;

  const [activeTab, setActiveTab] = useState<Tabs>(location?.state?.activeTab || Tabs.Stock);

  const planTabs = [
    {id: Tabs.Stock, title: 'Pregled zaliha', routeName: 'stock'},
    {id: Tabs.AssetMovement, title: ' Lista svih otpremnica', routeName: 'assetsMovement'},
  ];

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

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
  };

  return (
    <ScreenWrapper>
      <SectionBox>
        <TitleTabsWrapper>
          <MainTitle variant="bodyMedium" content={getTitle()} style={{marginBottom: 0}} />
          <StyledTabs tabs={planTabs} activeTab={activeTab} onChange={onTabChange} />
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />
        {activeTab === Tabs.Stock && <StockReview navigateToList={() => setActiveTab(Tabs.AssetMovement)} />}
        {activeTab === Tabs.AssetMovement && <MovementList />}
      </SectionBox>
    </ScreenWrapper>
  );
};
