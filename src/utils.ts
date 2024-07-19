import moment from "moment-timezone";
import { IconBase, IconType } from "react-icons";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

export interface Restaurant {
  location_id: number;
  timezone: string;
  name: string;
  description: string;
  photo: {
    images: {
      original: {
        url: string;
      };
    };
  };
  price_level: string;
  address_obj: {
    city: string;
  };
  raw_ranking: number;

  open_now_text: string;
  hours: {
    week_ranges: [
      [
        {
          open_time: number;
          close_time: number;
        }
      ]
    ];
  };
  cuisine: [
    {
      key: number;
      name: string;
    }
  ];
}

export interface Review {
  location_id: number;
  title: string;
  author: string;
  rating: number;
  published_date: string;
  text: string;
  user: {
    username: string;
    avatar: {
      small: {
        url: string;
      };
    };
  };
}

export const isOpenNow = (data: Restaurant) => {
  const timezone = data.timezone;
  const currentTime = moment().tz(timezone);
  const dayOfWeek = currentTime.day();
  const timeInMinutes = currentTime.hours() * 60 + currentTime.minutes();

  for (let range of data.hours.week_ranges) {
    if (
      range[0].open_time <= timeInMinutes &&
      timeInMinutes < range[0].close_time
    ) {
      return true;
    }
  }
  return false;
};

export const renderStars = (
  rating: number,
  elemenStars: any,
  elemenStarsHalf: any,
  elemenStarsOutline: any
) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(elemenStars);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(elemenStarsHalf);
    } else {
      stars.push(elemenStarsOutline);
    }
  }
  return stars;
};
