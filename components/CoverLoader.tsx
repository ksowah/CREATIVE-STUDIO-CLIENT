import { LinearProgress } from "@mui/material";


const CoverLoader = () => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-50">
      <LinearProgress className="w-full z-10" color="inherit" />
      <div className="w-full h-full bg-midDrakRgba"></div>
    </div>
  );
};

export default CoverLoader;
