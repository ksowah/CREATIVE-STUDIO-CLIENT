import { IoIosMore } from "react-icons/io";
import SessionAvatar from "./SessionAvatar";

const CommentItem = () => {
  return (
    <div className="flex">
      <SessionAvatar image="/images/kev.jpg" size={40} />
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium">Mike Blair</p>
            <p className="text-xs text-[#8c8c8c]">30 min. ago</p>
          </div>
          <IoIosMore size={20} className="cursor-pointer" />
        </div>

        <div className="my-4">
          <p className="text-sm">
            Wow, I stumbled upon this design, and I'm absolutely blown away! The
            attention to detail and the overall aesthetic are just phenomenal.
            The color scheme is so soothing yet engaging, and the layout is
            incredibly intuitive. I love how everything flows seamlessly, making
            it easy to navigate and explore.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
