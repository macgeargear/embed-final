import { dataFreq, dataFreqAQI } from "@/lib/utils";
import { useState } from "react";
import { LineChart } from "@tremor/react";
var state = 1;

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}`;

type Props = {
  data: any[];
  category?: string[];
};
export default function GraphRange({
  data,
  category = ["temperature", "co", "AQI"],
}: Props) {
  const [selected1, setSelected1] = useState(true);
  const [selected2, setSelected2] = useState(false);
  const [selected3, setSelected3] = useState(false);

  // Function to handle button click
  const handleButtonClick1hr = () => {
    setSelected1(true);
    setSelected2(false);
    setSelected3(false);
    state = 1;
  };
  const handleButtonClick6hr = () => {
    setSelected1(false);
    setSelected2(true);
    setSelected3(false);
    state = 2;
  };
  const handleButtonClick1day = () => {
    setSelected1(false);
    setSelected2(false);
    setSelected3(true);
    state = 3;
  };
  var plotData;
  if (category[0] == "AQI") {
    plotData = dataFreqAQI(data, state);
  } else {
    plotData = dataFreq(data, state);
  }
  return (
    <div className="block">
      <div className="flex items-start justify-between"></div>
      <div className="gap-4 flex">
        <button
          className={`mt-4 px-4 py-2 rounded-lg ${
            selected1 ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
          }`}
          onClick={handleButtonClick1hr}
        >
          1 hr
        </button>
        <button
          className={`mt-4 px-4 py-2 rounded-lg ${
            selected2 ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
          }`}
          onClick={handleButtonClick6hr}
        >
          6 hr
        </button>
        <button
          className={`mt-4 px-4 py-2 rounded-lg ${
            selected3 ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
          }`}
          onClick={handleButtonClick1day}
        >
          1 day
        </button>
      </div>
      <div className="p-4">
        <LineChart
          data={plotData}
          // data = {data}
          index="date"
          categories={category}
          colors={["indigo", "rose"]}
          valueFormatter={dataFormatter}
          onValueChange={(v) => console.log(v)}
          rotateLabelX={{ angle: 0 }}
          intervalType={"equidistantPreserveStart"}
        />
      </div>
    </div>
  );
}
