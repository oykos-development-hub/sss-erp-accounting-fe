import React, {FC, ReactElement, ReactNode} from 'react';
import {Breadcrumbs} from 'client-library';
import styled from 'styled-components';
import useAppContext from '../context/useAppContext';

const Container = styled.div`
  font-family: 'Source Sans Pro', sans-serif;
  background-color: #f8f8f8;
  padding: 28px 40px;
  height: calc(100vh - 157px);
  overflow-y: auto;
  box-sizing: border-box;

  ul {
    margin: 0;
    padding: 0;
  }
`;

const StyledBreadcrumbs = styled(Breadcrumbs)`
  padding: 0;
  margin: 0;
`;

const ScreenWrapper: FC<{children: ReactNode; showBreadcrumbs?: boolean}> = ({children, showBreadcrumbs = true}) => {
  const context = useAppContext();

  const breadcrumbs = context?.breadcrumbs;

  const breadcrumbItems = breadcrumbs?.get();

  const navigate = context?.navigation?.navigate;

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | undefined,
    item?: {
      name: string;
      to: string;
      icon?: ReactElement;
    },
  ) => {
    e?.preventDefault();
    const newBreacrumbs = [...breadcrumbItems];
    const index = newBreacrumbs.findIndex((breadcrumb: any) => breadcrumb.name === item?.name);
    newBreacrumbs.splice(index + 1, newBreacrumbs.length - index);
    breadcrumbs.set(newBreacrumbs);
    navigate(item?.to);
  };

  return (
    <Container>
      {showBreadcrumbs ? <StyledBreadcrumbs items={breadcrumbItems} onClick={handleNavigation} /> : null}
      {children}
    </Container>
  );
};

export default ScreenWrapper;
