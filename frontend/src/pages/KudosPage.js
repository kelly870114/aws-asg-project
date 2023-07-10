import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Button,
  Container,
  Stack,
  Typography,
  Grid,
  Box,
  Card,
  styled,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';
// components
import { ProductSort, ProductFilterSidebar } from '../sections/@dashboard/products';
import KudosList from '../sections/@dashboard/kudos/KudosList';
import avatar from '../assets/images/avatars/avatar_1.jpg';


// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Kudos
        </Typography>

        {/* filter, sort, sidebar for filter */}
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <Box sx={{ pt: '100%', position: 'relative' }}>
                <StyledProductImg src={avatar} />
              </Box>
              <Stack spacing={2} sx={{ p: 3 }} alignItems="center">
                <Link color="inherit" underline="hover">
                  <Typography variant="subtitle1" noWrap>
                    Ginny
                  </Typography>
                </Link>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2">Associate Solutions Architect</Typography>
                </Stack>
                <Button
                  variant="outlined"
                  sx={{
                    color: '#ff9900',
                    borderColor: '#ff9900',
                    '&:hover': {
                      color: '#ffffff',
                      borderColor: '#ff9900',
                      backgroundColor: '#ff9900',
                    },
                  }}
                  onClick={handleClickOpen('paper')}
                >
                  Give Kudos
                </Button>
                <Dialog open={open} onClose={handleClose} scroll={scroll} >
                  <DialogTitle>Give Kudos</DialogTitle>
                  <DialogContent>
                    <DialogContentText>Give your colleages some kudos 🫶</DialogContentText>
                    <TextField
                      id="kudos"
                      multiline
                      size="medium"
                      sx={{
                        paddingTop: '10px',
                      }}
                      fullWidth
                    />
                    <KudosList/>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="outlined"
                      sx={{
                        color: '#232f3e',
                        borderColor: '#232f3e',
                        '&:hover': {
                          color: '#232f3e',
                          borderColor: '#232f3e',
                          backgroundColor: '#ffffff',
                        },
                      }}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        color: '#ff9900',
                        borderColor: '#ff9900',
                        '&:hover': {
                          color: '#ff9900',
                          borderColor: '#ff9900',
                          backgroundColor: '#ffffff',
                        },
                      }}
                      onClick={handleClose}
                    >
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>Hello</Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>Hello</Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>Hello</Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>Hello</Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
