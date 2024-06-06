import Image, { ImageProps } from "next/image";
import ArtCover from "./ArtCover";

interface Props extends ImageProps {}

const ArtImage: React.FC<Props> = ({ src, alt, className, ...props }) => {
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={className}
      style={{ display: "inline-block" }}
    >
      <Image src={src} alt={alt} {...props} />
      <ArtCover />
    </div>
  );
};

export default ArtImage;
