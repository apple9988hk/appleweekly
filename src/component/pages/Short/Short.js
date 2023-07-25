import React from "react";
import { CircleFlag } from "react-circle-flags";

// https://flagpedia.net/download/api

function Short() {
  const data = [
    {
      country: "US",
      name: "Microsoft",
      cap: "2.475t",
    },
    {
      country: "US",
      name: "Alphabet (Google)",
      cap: "1.586t",
    },
    {
      country: "US",
      name: "NVIDIA",
      cap: "963.18b",
    },
    {
      country: "US",
      name: "Tesla",
      cap: "612.25b",
    },
    {
      country: "US",
      name: "IBM",
      cap: "117.03b",
    },
    {
      country: "IL",
      name: "Mobileye",
      cap: "36.19b",
    },
    {
      country: "US",
      name: "Palantir",
      cap: "28.91b",
    },
    {
      country: "US",
      name: "Dynatrace",
      cap: "14.46b",
    },
    {
      country: "US",
      name: "UiPath",
      cap: "8.75b",
    },
    {
      country: "US",
      name: "SentinelOne",
      cap: "6.01b",
    },
    {
      country: "US",
      name: "C3 AI",
      cap: "3.69b",
    },
    {
      country: "AE",
      name: "Bayanat AI",
      cap: "2.99b",
    },
    {
      country: "GB",
      name: "Darktrace",
      cap: "2.47b",
    },
    {
      country: "US",
      name: "Upstart",
      cap: "2.05b",
    },
    {
      country: "US",
      name: "Aurora Innovation",
      cap: "1.58b",
    },
    {
      country: "US",
      name: "PROS",
      cap: "1.31b",
    },
    {
      country: "US",
      name: "Cerence",
      cap: "1.10b",
    },
    {
      country: "GB",
      name: "Exscientia",
      cap: "0.98b",
    },
    {
      country: "US",
      name: "stem",
      cap: "0.76b",
    },
    {
      country: "US",
      name: "TuSimple",
      cap: "0.43b",
    },
  ];

  const btsData = 
    [
      {
        "rank": 1,
        "country": "Japan",
        "countryCode": "JP",
        "number of views": "35.1M views"
      },
      {
        "rank": 2,
        "country": "India",
        "countryCode": "IN",
        "number of views": "33.2M views"
      },
      {
        "rank": 3,
        "country": "Mexico",
        "countryCode": "MX",
        "number of views": "28M views"
      },
      {
        "rank": 4,
        "country": "Indonesia",
        "countryCode": "ID",
        "number of views": "23.7M views"
      },
      {
        "rank": 5,
        "country": "United States",
        "countryCode": "US",
        "number of views": "23.2M views"
      },
      {
        "rank": 6,
        "country": "Brazil",
        "countryCode": "BR",
        "number of views": "22.7M views"
      },
      {
        "rank": 7,
        "country": "South Korea",
        "countryCode": "KR",
        "number of views": "19.5M views"
      },
      {
        "rank": 8,
        "country": "Philippines",
        "countryCode": "PH",
        "number of views": "12.8M views"
      },
      {
        "rank": 9,
        "country": "Russia",
        "countryCode": "RU",
        "number of views": "9.85M views"
      },
      {
        "rank": 10,
        "country": "Thailand",
        "countryCode": "TH",
        "number of views": "9.4M views"
      },
      {
        "rank": 11,
        "country": "Argentina",
        "countryCode": "AR",
        "number of views": "8.23M views"
      },
      {
        "rank": 12,
        "country": "Peru",
        "countryCode": "PE",
        "number of views": "7.46M views"
      },
      {
        "rank": 13,
        "country": "Türkiye",
        "countryCode": "TR",
        "number of views": "7.15M views"
      },
      {
        "rank": 14,
        "country": "Malaysia",
        "countryCode": "MY",
        "number of views": "6.49M views"
      },
      {
        "rank": 15,
        "country": "Vietnam",
        "countryCode": "VN",
        "number of views": "6.07M views"
      },
      {
        "rank": 16,
        "country": "Colombia",
        "countryCode": "CO",
        "number of views": "5.32M views"
      },
      {
        "rank": 17,
        "country": "France",
        "countryCode": "FR",
        "number of views": "4.36M views"
      },
      {
        "rank": 18,
        "country": "Bangladesh",
        "countryCode": "BD",
        "number of views": "4.23M views"
      }
  ]

  return (
    <div className="p-5">
      <div className="mockup-phone border-primary">
        <div className="camera"></div>
        <div className="display">
          <div className="artboard artboard-demo phone-1 bg-gray-800">
            <div class="overflow-x-auto">
              <table class="table w-full ">
                <tbody>
                  {data.map((d, index) => {
                    return (
                      <tr className="border-0">
                        <td className="py-0.5 px-0.5 border-0 bg-gray-800">
                          <CircleFlag
                            countryCode={d.country.toLowerCase()}
                            className="h-3"
                          />{" "}
                        </td>
                        <td className="py-0.5 pl-0.5 border-0 text-sm text-gray-400 font-bold bg-gray-800">
                            {d.name}
                        </td>
                        <td className="py-0.5 border-0 text-sm font-bold text-gray-400 bg-gray-800">
                            {d.cap}
                        </td>
                      </tr>

                      // <img src={`https://flagcdn.com/${d.country.toLowerCase()}.svg`} className="h-4 w-6 rounded-full p-0"/>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Short;
