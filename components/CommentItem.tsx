import { IoIosMore } from "react-icons/io";
import SessionAvatar from "./SessionAvatar";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { REPLY_TO_COMMENT } from "@/apollo/mutations/designs";
import { useEffect, useState } from "react";
import Image from "next/image";
import { GET_COMMENT_REPLIES } from "@/apollo/queries/designs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import CssTextField from "./CSSTextField";
import { InputAdornment } from "@mui/material";
import { NEW_COMMENT_REPLY_SUBSCRIPTION } from "@/apollo/subscriptions";

const CommentItem = ({ comment }: { comment: DesignComment }) => {
  const [replyToComment, { loading }] = useMutation(REPLY_TO_COMMENT);

  const { data } = useQuery(GET_COMMENT_REPLIES, {
    variables: { commentId: comment?._id },
  });

  const [commentReplies, setCommentReplies] = useState<any>([]);

  useSubscription(NEW_COMMENT_REPLY_SUBSCRIPTION, {
    variables: { commentId: comment?._id },
    onSubscriptionData: ({ subscriptionData }) => {
      const newReply = subscriptionData.data.newCommentReply;
      // Update state with the new 
      setCommentReplies((prevReplies: [CommentReply]) => [...prevReplies, newReply]);
    },
  });


  useEffect(() => {
    setCommentReplies([...(data?.getCommentReplies || [])]);
  }, [data]);

  function getTimeDifference(timestamp: number) {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - timestamp;

    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = day * 365;

    if (timeDifference < minute) {
      return "Just now";
    } else if (timeDifference < hour) {
      const minutes = Math.floor(timeDifference / minute);
      return `${minutes} mins ago`;
    } else if (timeDifference < day) {
      const hours = Math.floor(timeDifference / hour);
      return `${hours} hours ago`;
    } else if (timeDifference < month) {
      const days = Math.floor(timeDifference / day);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (timeDifference < year) {
      const months = Math.floor(timeDifference / month);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(timeDifference / year);
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }
  }

  const [reply, setReply] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [userBeingReplied, setUserBeingReplied] = useState("");

  const addReplyToComment = async () => {
    try {
      if (reply !== "") {
        await replyToComment({
          variables: {
            commentId: comment?._id,
            reply: `@${userBeingReplied} ${reply}`,
          },
          onCompleted() {},
        });

        setReply("");
        setShowReplyInput(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openReplyInput = (username: string) => {
    setUserBeingReplied(username);
    setShowReplyInput(!showReplyInput);
  };

  const ReplyItem = ({ reply }: { reply: CommentReply }) => {
    const [username, setUsername] = useState("");
    const [replyContent, setReplyContent] = useState("");

    const formatRepliedMessage = (reply: string) => {
      const regex = /@(\w+)/;
      const match = reply?.match(regex);

      if (match) {
        setUsername(match[1]);
        setReplyContent(reply.replace(match[0], ""));
      } else {
        setReplyContent(reply);
      }
    };

    useEffect(() => {
      formatRepliedMessage(reply.reply);
    }, []);

    return (
      <div className="flex md:pl-[2rem]">
        <SessionAvatar image={reply.repliedBy.avatar} size={30} />
        <div className="pb-1 md:p-3">
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium">{reply.repliedBy.username}</p>
            <p className="text-xs text-[#8c8c8c]">{`${getTimeDifference(
              parseInt(reply?.repliedAt)
            )}`}</p>
          </div>

          <div className="my-4">
            <p className="text-[13px] md:text-[15px]">
              <span className="text-sky-700 cursor-pointer">
                <Link href={`/profile/${username}`}>{"@" + username}</Link>{" "}
              </span>{" "}
              {replyContent}
            </p>
            <p
              onClick={() => openReplyInput(reply?.repliedBy.username)}
              className="text-xs md:text-sm text-[#666666] cursor-pointer my-2 "
            >
              Reply
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex mb-[2rem] ">
      <SessionAvatar image={comment?.commentedBy.avatar} size={40} />
      <div className="p-3 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-[15px] font-medium">
              {comment?.commentedBy.username}
            </p>
            <p className="text-xs text-[#8c8c8c]">{`${getTimeDifference(
              parseInt(comment?.commentedAt)
            )}`}</p>
          </div>
          <IoIosMore size={20} className="cursor-pointer" />
        </div>

        <div className="my-4">
          <p className="text-[13px] md:text-[15px]">{comment?.comment}</p>
          <p
            onClick={() => openReplyInput(comment?.commentedBy.username)}
            className="text-xs md:text-sm text-[#666666] cursor-pointer my-2 "
          >
            Reply
          </p>
        </div>

        {/* REPLY ====== */}
        {commentReplies.map((reply: CommentReply, idx: any) => (
          <ReplyItem key={idx} reply={reply} />
        ))}

        {showReplyInput && (
          <div className="w-full flex items-center my-4 rounded-lg bg-[#f4f4f4]">
            <CssTextField
              value={reply}
              onChange={(e: any) => setReply(e.target.value)}
              placeholder={`You are replying to ${userBeingReplied}`}
              id="input-with-icon-textfield"
              className="flex-1 text-xs bg-transparent"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <div className="relative h-[1.2rem] w-[1.2rem] mx-2 cursor-pointer ">
                      {loading ? (
                        <AiOutlineLoading3Quarters className="animate-spin" />
                      ) : (
                        <Image
                          fill
                          src={"/icons/send.svg"}
                          alt=""
                          className="hover:scale-110 duration-150"
                          onClick={addReplyToComment}
                        />
                      )}
                    </div>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
