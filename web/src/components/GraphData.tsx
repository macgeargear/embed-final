import { LineChart } from "@tremor/react";

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}`;

type Props = {
  data: any[];
  category?: string[];
};

export default function GraphData({
  data,
  category = ["temperature", "co"],
}: Props) {
  return (
    <div className="p-4">
      <LineChart
        data={data}
        index="date"
        categories={category}
        colors={["indigo", "rose"]}
        valueFormatter={dataFormatter}
        onValueChange={(v) => console.log(v)}
        rotateLabelX={{ angle: 0 }}
        intervalType={"equidistantPreserveStart"}
      />
    </div>
  );
}
