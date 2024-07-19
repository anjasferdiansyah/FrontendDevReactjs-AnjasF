import React from "react";

import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { Restaurant, isOpenNow } from "../../utils";
import Link from "next/link";

const RestaurantCard = ({ data }: { data: Restaurant }) => {
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
    <div className="w-full flex flex-col justify-between">
      <img
        src={data.photo.images.original.url}
        className="w-full h-40 object-cover"
        alt=""
      />
      <div className="flex-1 pt-4">
        <h3 className="">{data.name}</h3>
        <div className="pb-4">{renderStars(data.raw_ranking)}</div>
        <div className="flex justify-between items-center pb-8">
          <div className="flex items-center gap-1">
            <p className="text-xs uppercase text-slate-500">
              {data.cuisine[0].name}
            </p>
            <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
            <p className="text-xs text-slate-500">{data.price_level}</p>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`w-1 h-1 block ${
                !isOpenNow(data) ? "bg-red-500" : "bg-green-500"
              } rounded-full`}
            ></span>
            <p className="text-xs uppercase text-slate-500 text-nowrap">
              {isOpenNow(data) ? "Open Now" : "Closed"}
            </p>
          </div>
        </div>
      </div>

      <Link
        href={`/detail/${data.location_id}`}
        className="p-2 flex justify-center items-center text-center w-full bg-[#002B56] text-white"
      >
        Learn More
      </Link>
    </div>
  );
};

export default RestaurantCard;
