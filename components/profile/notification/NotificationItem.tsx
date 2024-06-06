import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import BidPlacedDetails from "./BidPlacedDetails";
import Link from "next/link";
import { MyContext } from "@/context/Context";

const NotificationItem = ({notification}:{notification:UserNotification}) => {

  const [badgeTitle, setBadgeTitle] = useState("")
  const [badgeColor, setBadgeColor] = useState("")

  const notificationType = notification?.notificationType

  const {appState} = useContext(MyContext)

  const user:User = appState?.session

  useEffect(() => {

    const getBadgeTitle = (notificationType:string)=> {
      switch (notificationType) {
        case "bidPlaced":
          setBadgeTitle("Bid Placed")
          setBadgeColor("#9E65DA")
          break;
        case "bidOutbid":
          setBadgeTitle("Outbidded")
          setBadgeColor("#4B60CE")
          break;
        case "newFollower":
          setBadgeTitle("New Follower")
          setBadgeColor("#4B60CE")
          break;
        case "newOrder":
          setBadgeTitle("New Order")
          setBadgeColor("#9DD253")
          break;
        case "orderConfirmed":
          setBadgeTitle("Order Confirmed")
          setBadgeColor("#9DD253")
          break;
        case "newBid":
          setBadgeTitle("New Bid")
          setBadgeColor("#9DD253")
          break;
      
        default:
          setBadgeTitle("Notification")
          break;
      }
    }

    getBadgeTitle(notificationType)
   
  }, [notification])
  

  return (
    <Accordion >
      <AccordionSummary
        expandIcon={<IoChevronDown />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <div className="w-full flex justify-between">
          <div>
            <div style={{backgroundColor:badgeColor}} className="px-4 w-fit h-[2.3rem] rounded-lg flex items-center justify-center">
              <p className="text-white font-medium text-sm">{badgeTitle}</p>
            </div>
            <p className="mt-2 font-medium text-[#444444] ">
              {notification?.summary}
            </p>
          </div>

          <p className="text-xs text-[#8291A6] mr-4 ">29 May 2024 at 12:00am</p>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        {notificationType === "bidPlaced" ? (
          <BidPlacedDetails notification={notification} />
        ): notificationType === "orderConfirmed" ? (
          <>
          <p className="text-[#8291A6] text-sm mb-2">your order has been successfully placed.</p>
          <Link href={`/profile/${user?.username}/settings/orders`} className="text-[#056DFF] underline">view order details</Link>
          </>
        ) : (
          <p>yoooo</p>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default NotificationItem;
