"use client"
import { createTheme } from "@mui/material";


export const theme = createTheme({
    components: {
      // Name of the component
      MuiButtonBase: {
        styleOverrides: {
            root: ({ ownerState }) => ({
              ...(ownerState.variant === 'contained' &&
                ownerState.color === 'primary' && {
                  backgroundColor: '#000',
                  color: '#fff',
                }),
            }),
          },
      },
    },
  });