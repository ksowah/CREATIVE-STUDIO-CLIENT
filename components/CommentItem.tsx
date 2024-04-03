import { IoIosMore } from "react-icons/io";
import SessionAvatar from "./SessionAvatar";
import { useMutation, useQuery } from "@apollo/client";
import { REPLY_TO_COMMENT } from "@/apollo/mutations/designs";
import { useEffect, useState } from "react";
import Image from "next/image";
import { GET_COMMENT_REPLIES } from "@/apollo/queries/designs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import CssTextField from "./CSSTextField";
import { InputAdornment } from "@mui/material";

const CommentItem = ({ comment }: { comment: DesignComment }) => {
  const [replyToComment, { loading }] = useMutation(REPLY_TO_COMMENT);

  const { data } = useQuery(GET_COMMENT_REPLIES, {
    variables: { commentId: comment?._id },
  });

  console.log("comment repliess >>>", data);

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
          update: (cache, { data: { replyToComment } }) => {
            const existingReplies = cache.readQuery<any>({
              query: GET_COMMENT_REPLIES,
              variables: { commentId: comment?._id },
            });

            cache.writeQuery({
              query: GET_COMMENT_REPLIES,
              variables: { commentId: comment?._id },
              data: {
                getCommentReplies: [
                  replyToComment,
                  ...(existingReplies?.getCommentReplies || []),
                ],
              },
            });
          },
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
      const match = reply.match(regex);

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
      <div className="flex pl-[2rem] ">
        <SessionAvatar image={reply.repliedBy.avatar} size={30} />
        <div className="p-2">
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium">{reply.repliedBy.username}</p>
            <p className="text-xs text-[#8c8c8c]">30 min. ago</p>
          </div>

          <div className="my-4">
            <p className="text-sm">
              <span className="text-sky-700 cursor-pointer">
                <Link href={`/profile/${username}`}>{"@" + username}</Link>{" "}
              </span>{" "}
              {replyContent}
            </p>
            <p
              onClick={() => openReplyInput(reply?.repliedBy.username)}
              className="text-sm text-[#666666] cursor-pointer my-2 "
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
      <div className="p-3  flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium">
              {comment?.commentedBy.username}
            </p>
            <p className="text-xs text-[#8c8c8c]">30 min. ago</p>
          </div>
          <IoIosMore size={20} className="cursor-pointer" />
        </div>

        <div className="my-4">
          <p className="text-sm">{comment?.comment}</p>
          <p
            onClick={() => openReplyInput(comment?.commentedBy.username)}
            className="text-sm text-[#666666] cursor-pointer my-2 "
          >
            Reply
          </p>
        </div>

        {/* REPLY ====== */}
        {data?.getCommentReplies.map((reply: CommentReply, _: any) => (
          <ReplyItem key={reply._id} reply={reply} />
        ))}

        {showReplyInput && (
          <div className="w-full flex items-center my-4 rounded-lg bg-[#f4f4f4]">
            <CssTextField
              value={reply}
              onChange={(e:any) => setReply(e.target.value)}
              placeholder={`You are replying to ${userBeingReplied}`}
              id="input-with-icon-textfield"
              className="flex-1 text-sm bg-transparent"
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
