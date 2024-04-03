import { TextField } from "@mui/material";
import { withStyles } from "@mui/styles";


const CssTextField = withStyles({
    root: {
      '& label': {
        color: '#808080',
      },
      '& label.Mui-focused': {
        color: '#808080',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#A6A6A6',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#A6A6A6',
        },
        '&:hover fieldset': {
          borderColor: '#797979',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#000',
        },
      },
    },
  })(TextField);

  export default CssTextField