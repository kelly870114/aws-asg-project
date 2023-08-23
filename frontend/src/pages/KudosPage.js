import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [members, setMembers] = useState([]);
  const [allKudos, setKudos] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [kudosMessage, setKudosMessage] = useState('');

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState('paper');

  const handleClickOpen = (scrollType, member) => () => {
    setOpen(true);
    setScroll(scrollType);
    setSelectedMember(member);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleKudosMessageChange = (event) => {
    setKudosMessage(event.target.value);
  };

  const handleSubmitKudos = () => {
    // Check if a member is selected and a kudos message is entered
    if (!selectedMember || kudosMessage.trim() === '') {
      return;
    }

    // Prepare the data to be sent to the backend
    const newKudos = {
      from_id: 1, 
      to_id: selectedMember.member_id,
      message: kudosMessage.trim(),
    };

    // Call the backend API to save the kudos
    axios
      .post('http://127.0.0.1:5000/kudos', newKudos)
      .then((response) => {
        // Handle successful response if needed
        console.log('Kudos submitted successfully!');
        // Close the dialog after submission
        // handleClose(); 
        
        // Fetch Kudos after submitting Kudos
        getKudosFromBackend();
        // Clear the text field
        setKudosMessage('');
      })
      .catch((error) => {
        console.error('Error submitting kudos:', error);
      });
  };
  const getMembersFromBackend = () => {
    axios
      .get('http://127.0.0.1:5000/members')
      .then((response) => {
        setMembers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching members data:', error);
      });
  };

  const getKudosFromBackend = () => {
    axios
      .get('http://127.0.0.1:5000/kudos')
      .then((response) => {
        setKudos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching kudos data:', error);
      });
  };

  useEffect(() => {
    getMembersFromBackend();
    getKudosFromBackend();
  }, []);

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
          {/* Member Cards */}
          {members.map((member) => (
            <Grid item xs={12} sm={6} md={3} key={member.member_id}>
              <Card>
                <Box sx={{ pt: '100%', position: 'relative' }}>
                  {/* Assuming the 'avatar' field is available in your employee data */}
                  <StyledProductImg src={member.member_avatar} />
                </Box>
                <Stack spacing={2} sx={{ p: 3 }} alignItems="center">
                  <Link color="inherit" underline="hover">
                    <Typography variant="subtitle1" noWrap>
                      {member.member_name}
                    </Typography>
                  </Link>

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2"> {member.job_title} </Typography>
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
                    onClick={handleClickOpen('paper', member)}
                  >
                    Give Kudos
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Kudos Dialog */}
        <Dialog open={open} onClose={handleClose} scroll={scroll}>
          <DialogTitle>Give Kudos</DialogTitle>
          <DialogContent>
            <DialogContentText>Give your colleague some kudos 🫶</DialogContentText>
            <TextField
              id="kudos"
              multiline
              size="medium"
              sx={{
                paddingTop: '10px',
              }}
              fullWidth
              value={kudosMessage} // Use the kudosMessage state as the value
              onChange={handleKudosMessageChange} // Call the onChange handler
            />
            {selectedMember && <KudosList kudos={allKudos.filter((kudo) => kudo.to_id === selectedMember.member_id)} />}
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
              onClick={handleSubmitKudos}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
