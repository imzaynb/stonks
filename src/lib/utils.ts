import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCurrentDateInNY = () => {
  const dmyString = convertDateToDateInNY(new Date());
  return DMYToYMD(dmyString);
}

export const getYesterdayDateInNY = (today: string) => {
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  const dmyString = convertDateToDateInNY(yesterday);
  return DMYToYMD(dmyString);
}

const convertDateToDateInNY = (date: Date) => {
  // this is necessary to convert whatever day it is to the day in New York
  let intlDateObj = new Intl.DateTimeFormat('en-US', {
    timeZone: "America/New_York",
  });

  // This returns a string in M/D/YYYY form 
  const dmyString = intlDateObj.format(date);

  return dmyString;
}

const DMYToYMD = (dmyString: string) => {
  const parts = dmyString.split("/");

  const year = parts[2];

  // this will make the number always be 2 digits and look like 0# or ## depending on what day/month it is
  // thanks to https://stackoverflow.com/questions/8043026/how-to-format-numbers-by-prepending-0-to-single-digit-numbers
  const month = ("0" + parts[0]).slice(-2);
  const day = ("0" + parts[1]).slice(-2);

  return `${year}-${month}-${day}`;
}

// FIXME: correct type
export const buyStockFormSchema: any = z.object({
  ticker: z.string().min(1, {
    message: "Ticker must be at least 1 character.",
  }),
  shares: z.preprocess(
    (value) => parseInt(value as string, 10),
    z
      .number({ invalid_type_error: "Please enter a number" })
      .int({ message: "Please enter an integer" })
      .positive({ message: "Please keep the number positive." })
      .safe()
      .finite(),
  )
})

export const USDollar = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});