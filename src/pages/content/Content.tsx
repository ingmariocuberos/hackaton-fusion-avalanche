import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { contentData } from '../../data/contentData';
import { sectionButtonStyle } from './styles';

const Content: React.FC = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  const handleClick = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handleItemClick = (categoryTitle: string, itemIndex: number) => {
    navigate(`/contenido/${categoryTitle}/${itemIndex}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Contenido Educativo
      </Typography>
      <Paper elevation={3} sx={{ p: 2 }}>
        {contentData.map((section) => (
          <List
            key={section.title}
            component="nav"
            sx={{
              '&:not(:last-child)': {
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              },
            }}
          >
            <ListItem
              component="button"
              onClick={() => handleClick(section.title)}
              sx={sectionButtonStyle}
            >
              <ListItemText
                primary={
                  <Typography variant="h6" component="div">
                    {section.title}
                  </Typography>
                }
              />
              {openSections[section.title] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openSections[section.title]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {section.items.map((item, index) => (
                  <ListItem
                    key={index}
                    component="button"
                    onClick={() => handleItemClick(section.title, index)}
                    sx={sectionButtonStyle}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body1">
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </List>
        ))}
      </Paper>
    </Container>
  );
};

export default Content; 