import { Review } from "@/utils";
import React from "react";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

const ReviewCard = ({ data }: { data: Review }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<IoIosStar className="inline text-[#002B56]" key={i} />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<IoIosStarHalf className="inline text-[#002B56]" key={i} />);
      } else {
        stars.push(
          <IoIosStarOutline className="inline text-[#002B56]" key={i} />
        );
      }
    }
    return stars;
  };

  return (
    <div className="wrapper py-4 border-b border-slate-300">
      <div className="flex items-center gap-4">
        <img
          src={data?.user.avatar.small.url}
          className="w-12 h-12 rounded-full object-cover"
          alt=""
        />
        <div>
          <p className="font-semibold">{data?.user.username}</p>
          <p className="text-sm">{renderStars(data?.rating)}</p>
        </div>
      </div>
      <div className="py-4">
        <p className="text-sm font-bold">{data?.title}</p>
        <p>{data?.text}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
