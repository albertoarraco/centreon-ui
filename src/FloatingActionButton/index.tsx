import * as React from 'react';

import { Fab } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

const FloatingActionButton = (): JSX.Element => (
  <Fab color="primary" aria-label="add">
    <AddIcon />
  </Fab>
);

export default FloatingActionButton;
