import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import avatar from '../../../assets/images/avatars/avatar_10.jpg';

export default function KudosList({ kudos }) {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {kudos.map((kudo) => (
        <React.Fragment key={kudo.kudos_id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar src={avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={kudo.sender_name} // Display the member_name of the sender or receiver, depending on your use case
              secondary={
                <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                  {kudo.message}
                </Typography>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  );
}
