import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn, getAQITrend } from "@/lib/utils";

type Props = {
  AQI: number;
};

export default function TrendPopover({ AQI }: Props) {
  const trend = getAQITrend(AQI);
  return (
    <Popover>
      <PopoverTrigger asChild className={cn(`text-${trend.color}`)}>
        <div>{trend.level}</div>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white cursor-pointer">
        <h1 className="text-xl">{AQI}</h1>
        <h1 className={cn(`text-${trend.color}`, "text-md")}>{trend.level}</h1>
        <hr className="my-2" />
        <p className="text-sm">{trend.desc}</p>
      </PopoverContent>
    </Popover>
  );
}
