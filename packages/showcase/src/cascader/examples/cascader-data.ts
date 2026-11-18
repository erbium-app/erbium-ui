import type { CascaderNode } from "@erbium/ui/components/cascader";

/** Continents, countries and cities, three levels deep. */
export const regions: CascaderNode[] = [
  {
    value: "africa",
    label: "Africa",
    children: [
      {
        value: "egypt",
        label: "Egypt",
        children: [
          { value: "cairo", label: "Cairo" },
          { value: "alexandria", label: "Alexandria" },
        ],
      },
      {
        value: "kenya",
        label: "Kenya",
        children: [
          { value: "nairobi", label: "Nairobi" },
          { value: "mombasa", label: "Mombasa" },
        ],
      },
      {
        value: "nigeria",
        label: "Nigeria",
        children: [
          { value: "lagos", label: "Lagos" },
          { value: "abuja", label: "Abuja" },
        ],
      },
    ],
  },
  {
    value: "asia",
    label: "Asia",
    children: [
      {
        value: "japan",
        label: "Japan",
        children: [
          { value: "tokyo", label: "Tokyo" },
          { value: "osaka", label: "Osaka" },
          { value: "kyoto", label: "Kyoto" },
        ],
      },
      {
        value: "singapore",
        label: "Singapore",
        children: [{ value: "singapore-city", label: "Singapore" }],
      },
      {
        value: "south-korea",
        label: "South Korea",
        children: [
          { value: "seoul", label: "Seoul" },
          { value: "busan", label: "Busan" },
        ],
      },
    ],
  },
  {
    value: "europe",
    label: "Europe",
    children: [
      {
        value: "france",
        label: "France",
        children: [
          { value: "paris", label: "Paris" },
          { value: "lyon", label: "Lyon" },
          { value: "marseille", label: "Marseille" },
        ],
      },
      {
        value: "germany",
        label: "Germany",
        children: [
          { value: "berlin", label: "Berlin" },
          { value: "munich", label: "Munich", keywords: ["München"] },
          { value: "hamburg", label: "Hamburg" },
        ],
      },
      {
        value: "united-kingdom",
        label: "United Kingdom",
        keywords: ["UK", "Britain"],
        children: [
          { value: "london", label: "London" },
          { value: "manchester", label: "Manchester" },
          { value: "edinburgh", label: "Edinburgh" },
        ],
      },
    ],
  },
  {
    value: "north-america",
    label: "North America",
    children: [
      {
        value: "canada",
        label: "Canada",
        children: [
          { value: "toronto", label: "Toronto" },
          { value: "vancouver", label: "Vancouver" },
          { value: "montreal", label: "Montréal" },
        ],
      },
      {
        value: "united-states",
        label: "United States",
        keywords: ["USA", "US"],
        children: [
          { value: "new-york", label: "New York", keywords: ["NYC"] },
          { value: "san-francisco", label: "San Francisco", keywords: ["SF"] },
          { value: "chicago", label: "Chicago" },
          { value: "austin", label: "Austin" },
        ],
      },
    ],
  },
  {
    value: "oceania",
    label: "Oceania",
    children: [
      {
        value: "australia",
        label: "Australia",
        children: [
          { value: "sydney", label: "Sydney" },
          { value: "melbourne", label: "Melbourne" },
          { value: "brisbane", label: "Brisbane" },
        ],
      },
      {
        value: "new-zealand",
        label: "New Zealand",
        children: [
          { value: "auckland", label: "Auckland" },
          { value: "wellington", label: "Wellington" },
        ],
      },
    ],
  },
];
