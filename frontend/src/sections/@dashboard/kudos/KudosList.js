import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { IconButton, TextField } from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import axios from 'axios';

export default function KudosList({ kudos }) {
  const [editingKudosId, setEditingKudosId] = React.useState(null);
  const [editedMessage, setEditedMessage] = React.useState('');
  const [allKudos, setKudos] = React.useState([]);

  const handleEditKudos = (kudosId) => {
    setEditingKudosId(kudosId);
    const kudosToEdit = kudos.find((kudo) => kudo.kudos_id === kudosId);
    setEditedMessage(kudosToEdit.message);
  };

  const handleSaveEditKudos = () => {
    // Save the edited message to the backend using the kudosId
    const kudosToEdit = kudos.find((kudo) => kudo.kudos_id === editingKudosId);

    if (!kudosToEdit || editedMessage.trim() === '') {
      // Return early if the kudos or edited message is not valid
      return;
    }

    const updatedKudos = {
      ...kudosToEdit,
      message: editedMessage.trim(),
    };

    axios
      .put(`http://127.0.0.1:5000/kudos/${editingKudosId}`, updatedKudos)
      .then((response) => {
        // Update the kudos list with the updated kudos after successful save
        const updatedKudosList = kudos.map((kudo) =>
          kudo.kudos_id === editingKudosId ? { ...kudo, message: editedMessage.trim() } : kudo
        );
        // Update the allKudos state with the updated kudos list
        setKudos(updatedKudosList);
        setEditingKudosId(null);
        setEditedMessage('');
      })
      .catch((error) => {
        console.error('Error saving edited kudos:', error);
      });
  };

  const handleCancelEditKudos = () => {
    setEditingKudosId(null);
    setEditedMessage('');
  };

  const handleDeleteKudos = (kudosId) => {
    axios
      .delete(`http://127.0.0.1:5000/kudos/${kudosId}`)
      .then((response) => {
        console.log(`Kudos with ID ${kudosId} deleted successfully.`);
      })
      .catch((error) => {
        console.error('Error deleting kudos:', error);
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

  React.useEffect(() => {
    getKudosFromBackend();
  }, []);

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {kudos.map((kudo) => (
        <React.Fragment key={kudo.kudos_id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar src="https://project-avatar-bucket.s3.us-west-1.amazonaws.com/avatar_1.jpg" />
            </ListItemAvatar>
            {editingKudosId === kudo.kudos_id ? (
              <TextField
                fullWidth
                multiline
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                variant="outlined"
              />
            ) : (
              <ListItemText
                primary={kudo.sender_name}
                secondary={
                  <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                    {kudo.message}
                  </Typography>
                }
              />
            )}
            {editingKudosId === kudo.kudos_id ? (
              <>
                <IconButton edge="end" aria-label="save" onClick={handleSaveEditKudos}>
                  <Save />
                </IconButton>
                <IconButton edge="end" aria-label="cancel" onClick={handleCancelEditKudos}>
                  <Cancel />
                </IconButton>
              </>
            ) : (
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditKudos(kudo.kudos_id)}>
                <Edit />
              </IconButton>
            )}
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteKudos(kudo.kudos_id)}>
              <Delete />
            </IconButton>
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  );
}
