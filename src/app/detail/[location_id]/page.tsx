"use client";
import ReviewCard from "@/components/ReviewCard";
import { renderStars, Review } from "@/utils";
import axios from "axios";
import React from "react";
import { DiVim } from "react-icons/di";
import {
  FaEnvelope,
  FaLaptop,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { PiNeedle } from "react-icons/pi";
import useSWR from "swr";

const DetailRestaurant = ({
  params: { location_id },
}: {
  params: { location_id: number };
}) => {
  const urlDetail = "https://restaurants222.p.rapidapi.com/detail";
  const urlReviews = "https://restaurants222.p.rapidapi.com/reviews";

  const fetcher = (url: string) =>
    axios
      .request({
        method: "POST",
        url: url,
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
          "x-rapidapi-host": "restaurants222.p.rapidapi.com",
        },
        data: {
          language: "id_ID",
          location_id: location_id,
          currency: "IDR",
          offset: 0,
        },
      })
      .then((response) => response.data);

  const {
    data: detail,
    isLoading,
    error,
  } = useSWR(urlDetail, fetcher, {
    refreshInterval: 10000,
  });

  const {
    data: reviews,
    isLoading: isLoadingReviews,
    error: errorReviews,
  } = useSWR(urlReviews, fetcher, {
    refreshInterval: 10000,
  });

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<IoIosStar className="inline text-[#002B56] text-lg" />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<IoIosStarHalf className="inline text-[#002B56] text-lg" />);
      } else {
        stars.push(
          <IoIosStarOutline className="inline text-[#002B56] text-lg" />
        );
      }
    }
    return stars;
  };

  const reviewUser = reviews?.results?.data.filter(
    (review: Review) => review.location_id === location_id
  );

  console.log(reviewUser);

  const lat = detail?.results.latitude;
  const lon = detail?.results.longitude;
  const zoom = 15;

  return (
    <div className="container md:max-w-screen-lg px-8 mx-auto">
      <h1 className="text-3xl py-8">Detail Restaurant</h1>

      {isLoading ? (
        <div>
          <div className="w-full h-96 bg-slate-300 animate-pulse mb-4"></div>
          <div className="w-1/2 h-12 bg-slate-300 animate-pulse mb-4"></div>
          <div className="w-1/2 h-12 bg-slate-300 animate-pulse mb-4"></div>
        </div>
      ) : (
        <div>
          <img
            src={detail?.results?.photo?.images?.original?.url}
            alt=""
            className="w-full h-96 object-cover"
          />
          <p className="pt-8 text-3xl font-semibold">{detail?.results.name}</p>
          <div className="flex pb-4">
            {renderStars(detail?.results.raw_ranking)}
            <p className="pl-4">{detail?.results.num_reviews} reviews</p>
          </div>
          <p className="pb-4">{detail?.results.price}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex gap-8">
          <div className="w-2/3 h-96 bg-slate-300 animate-pulse mb-4"></div>
          <div className="w-1/3 h-96 bg-slate-300 animate-pulse mb-4"></div>
        </div>
      ) : (
        <div className="py-2 flex w-full gap-8">
          <div className="p-6 bg-white border border-slate-400 rounded-md">
            <p className="">{detail?.results.description}</p>
            <p className="my-8 text-[#002B56] text-xl">Reviews</p>
            <div className="container h-[400px] overflow-y-scroll">
              {detail &&
                reviewUser?.map((item: Review, index: number) => (
                  <ReviewCard data={item} key={index} />
                ))}
            </div>
          </div>

          <div className="w-1/3">
            <p className="py-4 text-xl font-semibold">Location and Contact</p>
            <iframe
              width="300"
              height="300"
              style={{ border: "none" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${lat},${lon}&z=${zoom}&output=embed`}
              title="google map"
            ></iframe>
            <div className="flex items-center gap-2 py-4">
              <FaMapMarkerAlt size={25} className="text-[#002B56] " />
              <p className="text-sm">{detail?.results.address}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="w-full">
                <FaLaptop size={20} className="inline text-[#002B56] mr-2 " />
                Website
              </p>
              <p className="w-full">
                <FaEnvelope size={20} className="inline text-[#002B56] mr-2 " />
                Email
              </p>
              <p className="w-full">
                <FaPhoneAlt size={20} className="inline text-[#002B56] mr-2 " />
                Call
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailRestaurant;
