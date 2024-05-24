import React from "react";
import MaxWidthWrapper from "./MaxwidthWrapper";
import { AQIData, dataFreqAQI, getWeekRange, AQITrend, cn } from "@/lib/utils";
import { DataTable } from "./AirQualityTrendTable/DataTable";
import { columns } from "./AirQualityTrendTable/columns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import format from "date-fns/format";

type Props = {
  data: AQIData;
};

export default function AirQualityTrend({ data }: Props) {
  const AQIData = dataFreqAQI(data, 3);
  const currWeekRange = getWeekRange();
  const [date, setDate] = React.useState<Date | undefined>(
    currWeekRange.startOfWeek
  );
  const { startOfWeek, endOfWeek } = getWeekRange(date);
  const trend = AQITrend(AQIData, date);
  return (
    <MaxWidthWrapper className="w-full px-0 md:px-0">
      <div className="rounded-xl w-full border p-4">
        <h1 className="text-xl font-semibold text-start">
          Air Quality Trend for this week
        </h1>
        <div className="flex items-center gap-2 my-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto bg-white">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="font-sm px-2">
            {format(startOfWeek, "PPP")} - {format(endOfWeek, "PPP")}
          </p>
        </div>

        <div className="container mx-auto py-2">
          <DataTable columns={columns} data={trend} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
