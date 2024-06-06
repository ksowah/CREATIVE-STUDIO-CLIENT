"use client"

import { GET_NOTIFICATIONS } from "@/apollo/queries/user";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SettingsContainer from "@/components/SettingsContainer";
import NotificationItem from "@/components/profile/notification/NotificationItem";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

const Notifications = () => {

  const {data, refetch} = useQuery(GET_NOTIFICATIONS)

  const notifications:[UserNotification] = data?.getNotifications

  useEffect(() => {
    refetch()
  }, [])
  

  return (
    <div className="bg-[#F3F3F3] min-h-screen ">
      <Header />
      <Container>
        <SettingsContainer>
          <div className="p-[2rem] ">
            <h2 className="font-medium text-[1.6rem] ">Notifications</h2>
          </div>

          <div className="pt-[2rem] pb-[4rem] px-[2rem] ">
            {notifications?.map((notification:UserNotification) => (
              <NotificationItem key={notification?._id} notification={notification} />
            ))}
          </div>
        </SettingsContainer>

        <Footer />
      </Container>
    </div>
  );
};

export default Notifications;
