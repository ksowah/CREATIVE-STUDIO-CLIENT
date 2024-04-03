import TextField from "@mui/material/TextField";

const CssTextField = (props: any) => (
  <TextField
    {...props}
    sx={{
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
    }}
  />
);

export default CssTextField;
