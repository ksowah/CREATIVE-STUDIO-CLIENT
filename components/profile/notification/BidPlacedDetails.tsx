import { GET_ART_BY_ID } from "@/apollo/queries/arts";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import React from "react";

const BidPlacedDetails = ({
  notification,
}: {
  notification: UserNotification;
}) => {
  const artId = notification?.artWorks?.[0];

  const { data: artData, loading } = useQuery(GET_ART_BY_ID, {
    variables: { artId },
  });

  const artDetails: ArtPiece = artData?.getArtById;

  return (
    <div className="w-full">
      <p className="text-[#8291A6] text-sm">
        Congratulations! We wanted to inform you that your bid on the artwork
        &quot;{artDetails?.title}&quot; by {artDetails?.artist?.fullName} has been successful.
      </p>

      <p className="text-[#8291A6] text-sm mb-2">
        If you have any questions or need assistance, feel free to reach out to
        our support team at <span className="font-medium">sowahkelvin640@gmail.com</span> or <span className="font-medium">+233-201-691-438</span>
      </p>

      <Link href={`/art/auction/details/${artId}`} className="text-[#056DFF] underline">View auction details</Link>
    </div>
  );
};

export default BidPlacedDetails;
