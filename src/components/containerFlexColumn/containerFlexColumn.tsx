import React, { ReactNode } from 'react';

import { Container, ContainerProps } from '@mui/material';

const ContainerFlexColumn = (props: ContainerProps & {children: ReactNode}) => {
  const {children, sx, ...containerProps} = props;
  return (
    <Container sx={{
      display: 'flex',
      flexDirection: "column",
      ...sx,
    }}{...containerProps}>
      {children}
    </Container>
  );
};

export default ContainerFlexColumn;