import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

export function ApiError() {
  
  return (
    <Container maxWidth="lg">
    <Grid container spacing={1}>
      <Box p={2}>
        <h1>Error: could not load turnouts. Check settings and make sure the API host is running.</h1>
      </Box>
    </Grid>
  </Container>
  );

}

export default ApiError;