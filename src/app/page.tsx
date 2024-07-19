"use client";
import RestaurantCard from "@/components/RestaurantCard";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { isOpenNow, Restaurant } from "@/utils";

export default function Home() {
  const url = "https://worldwide-restaurants.p.rapidapi.com/search";

  const [openNowFilter, setOpenNowFilter] = useState(false);
  const [priceFilter, setPriceFilter] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");

  const fetcher = (url: string) =>
    axios
      .request({
        method: "POST",
        url: url,
        headers: {
          "x-rapidapi-key":
            // Masukkan API Key Untuk Restaurant API di RapidAPI
            process.env.NEXT_PUBLIC_RAPID_API_KEY,
          "x-rapidapi-host": "restaurants222.p.rapidapi.com",
        },
        data: {
          language: "id_ID",
          location_id: 297704,
          currency: "IDR",
          offset: 0,
        },
      })
      .then((response) => response.data);

  const { data, isLoading, error } = useSWR(url, fetcher, {
    refreshInterval: 10000,
  });

  console.log(error);
  const skeletonArray = Array(12).fill(0);

  const [visibleCount, setVisibleCount] = useState(12);
  const loadMore = () => setVisibleCount(visibleCount + 4);

  const matchPrice = (restaurantPrice: string, filterPrice: string) => {
    const priceLevels = ["$", "$$", "$$$", "$$$$"];
    const restaurantRange = restaurantPrice.split(" - ");

    return restaurantRange.some(
      (price) => priceLevels.indexOf(price) <= priceLevels.indexOf(filterPrice)
    );
  };

  let filteredData = data?.results.data;

  if (openNowFilter) {
    filteredData = filteredData?.filter((data: Restaurant) => isOpenNow(data));
  } else if (priceFilter !== "") {
    filteredData = filteredData?.filter((data: Restaurant) =>
      matchPrice(data.price_level, priceFilter)
    );
  } else if (openNowFilter && priceFilter !== "") {
    filteredData = filteredData
      ?.filter((data: Restaurant) => isOpenNow(data))
      .filter((data: Restaurant) => matchPrice(data.price_level, priceFilter));
  } else if (cuisineFilter !== "") {
    filteredData = filteredData?.filter((data: Restaurant) =>
      data.cuisine.some((cuisine) => cuisine.name === cuisineFilter)
    );
  } else if (openNowFilter && cuisineFilter !== "" && priceFilter !== "") {
    filteredData = filteredData
      ?.filter((data: Restaurant) => isOpenNow(data))
      .filter((data: Restaurant) => matchPrice(data.price_level, priceFilter))
      .filter((data: Restaurant) =>
        data.cuisine.some((cuisine) => cuisine.name === cuisineFilter)
      );
  } else {
    filteredData = data?.results.data;
  }

  const clearFilter = () => {
    setOpenNowFilter(false);
    setPriceFilter("");
    setCuisineFilter("");
  };

  return (
    <div className="container md:max-w-screen-lg px-8 mx-auto">
      <h1 className="text-4xl py-4">Restaurant</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum quas id
        quae reiciendis minima repudiandae sequi consectetur dignissimos
        accusamus eius!
      </p>
      <div className="w-full  border-y border-gray-200 py-4 my-4">
        <div className="flex gap-4 justify-between items-center">
          <div className="flex gap-2">
            <p>Filter By :</p>
            <input
              name="openNow"
              id="openNow"
              type="checkbox"
              checked={openNowFilter}
              onChange={() => setOpenNowFilter(!openNowFilter)}
              className="rounded-full"
            />
            <label htmlFor="openNow" className="border-b border-b-gray-300">
              Open Now
            </label>
            <select
              className="border-b border-b-gray-300"
              name="price"
              id=""
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option defaultValue={""} value="" disabled>
                Price
              </option>
              <option value="$">$</option>
              <option value="$$">$$</option>
              <option value="$$$">$$$</option>
              <option value="$$$$">$$$$</option>
            </select>
            <select
              className="border-b border-b-gray-300"
              name="category"
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
              id=""
            >
              <option defaultValue={""} value="" disabled>
                Cuisine
              </option>
              {data?.results.data.map((dataRestaurant: any, index: number) => {
                return (
                  <option key={index} value={dataRestaurant.cuisine[0].name}>
                    {dataRestaurant.cuisine[0].name}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            onClick={clearFilter}
            className="bg-[#002B56] text-white px-4 py-2"
          >
            Clear All
          </button>
        </div>
      </div>
      <div>
        <h1 className="text-2xl my-8">All Restaurant</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
          {isLoading &&
            skeletonArray.map((_, index) => {
              return (
                <div key={index} className="w-full animate-pulse">
                  <div className="w-full h-40 bg-gray-300"></div>
                  <div className="w-full h-4 bg-gray-300 mt-4"></div>
                  <div className="w-full max-w-[60%] h-4 bg-gray-300 mt-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="w-full max-w-[40%] h-4 bg-gray-300 mt-4"></div>
                    <div className="w-full max-w-[40%] h-4 bg-gray-300 mt-4"></div>
                  </div>
                  <div className="w-full h-8 bg-gray-300 mt-4"></div>
                </div>
              );
            })}
          {data &&
            filteredData
              .slice(0, visibleCount)
              .map((restaurant: any) => (
                <RestaurantCard key={restaurant.id} data={restaurant} />
              ))}
        </div>
        <div className="flex justify-center my-8">
          {filteredData && visibleCount < data?.results.data.length && (
            <button
              onClick={loadMore}
              className="mt-4 w-full max-w-xs border border-[#002B56] text-[#002B56] py-2 px-4 rounded"
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
