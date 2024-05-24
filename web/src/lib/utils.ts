import { Icons } from "@/components/Icons";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SensorData = {
  date: string;
  pm25: number;
  humidity: number;
  co: number;
  temperature: number;
}[];

export type AQIData = {
  date: string;
  AQI: number;
}[];

enum AQILevel {
  Good = "Good",
  Moderate = "Moderate",
  UnhealthyForSensitiveGroups = "Unhealthy for Sensitive Groups",
  Unhealthy = "Unhealthy",
  VeryUnhealthy = "Very Unhealthy",
  Hazardous = "Hazardous",
}

export const AQIBasics = {
  good: {
    level: AQILevel.Good,
    desc: "Air quality is satisfactory, and air pollution poses little or no risk.",
    color: "green-400",
  },
  moderate: {
    level: AQILevel.Moderate,
    desc: "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
    color: "yellow-400",
  },
  unhealthyForSensitiveGroups: {
    level: AQILevel.UnhealthyForSensitiveGroups,
    desc: "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
    color: "orange-400",
  },
  unhealthy: {
    level: AQILevel.Unhealthy,
    desc: "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
    color: "red-400",
  },
  veryUnhealthy: {
    level: AQILevel.VeryUnhealthy,
    desc: "Health alert: The risk of health effects is increased for everyone.",
    color: "fuchsia-400",
  },
  hazardous: {
    level: AQILevel.Hazardous,
    desc: "Health warning of emergency conditions: everyone is more likely to be affected.",
    color: "bg-red-400",
  },
  noData: {
    level: "no data",
    desc: "no data for this day",
    color: "bg-slate-100 text-black",
  },
};

export function getAQITrend(AQI: number) {
  if (AQI < 0) return AQIBasics["noData"];
  else if (AQI >= 0 && AQI <= 50) return AQIBasics["good"];
  else if (AQI > 50 && AQI <= 100) return AQIBasics["moderate"];
  else if (AQI > 100 && AQI <= 150)
    return AQIBasics["unhealthyForSensitiveGroups"];
  else if (AQI > 150 && AQI <= 200) return AQIBasics["unhealthy"];
  else if (AQI > 200 && AQI <= 300) return AQIBasics["veryUnhealthy"];
  else return AQIBasics["hazardous"];
}

export function formatDate(date: string) {
  return format(new Date(Number(date) * 1000), "MM/dd/yyyy HH:mm:ss");
}

export function mapSensorData(data: {
  date: { humidity: number; co: number; temperature: number };
}) {
  return Object.entries(data).map(([date, value]) => {
    return {
      date: formatDate(date),
      humidity: value["humidity"],
      co: value["co"],
      temperature: value["temperature"],
      pm25: 30,
    };
  });
}

export function mapAQIData(sensorData: SensorData) {
  return sensorData.map((data) => ({
    date: data.date,
    AQI: calculateAQI(data.pm25, data.humidity, data.co, data.temperature),
  }));
}

export function generateMockTrend() {
  return [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ].map((day) => ({
    day,
    AQI: Math.floor(Math.random() * 300),
  }));
}

export function getWeekRange(date: Date = new Date()): {
  startOfWeek: Date;
  endOfWeek: Date;
} {
  const currentDay = date.getDay();
  const daysToMonday = (currentDay + 6) % 7;

  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - daysToMonday);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return { startOfWeek, endOfWeek };
  // return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
}

export function calculateAQI(
  pm25: number,
  humidity: number,
  co: number,
  temperature: number
): number {
  // Define ranges and weights for each parameter
  const pm25Ranges = [
    [0, 12],
    [12, 35],
    [35, Infinity],
  ]; // Low, moderate, high
  const pm25Weights = [1, 0.5, 0.3]; // Weight for each range
  const humidityRange = [30, 60]; // Average range
  const humidityWeight = 0.2;
  const coRanges = [
    [0, 9],
    [9, 35],
    [35, Infinity],
  ]; // Low, moderate, high
  const coWeights = [1, 0.5, 0.3]; // Weight for each range
  const temperatureRanges = [
    [15, 25],
    [25, 30],
    [30, Infinity],
  ]; // Low, moderate, high
  const temperatureWeights = [1, 0.5, 0.3]; // Weight for each range

  // Calculate individual scores for each parameter
  const pm25Score = pm25Ranges.reduce((acc, [rangeMin, rangeMax], index) => {
    return (
      acc +
      (pm25Weights[index] *
        (Math.min(Math.max(pm25, rangeMin), rangeMax) - rangeMin)) /
        (rangeMax - rangeMin)
    );
  }, 0);
  const humidityScore =
    ((Math.min(Math.max(humidity, humidityRange[0]), humidityRange[1]) -
      humidityRange[0]) /
      (humidityRange[1] - humidityRange[0])) *
    humidityWeight;
  const coScore = coRanges.reduce((acc, [rangeMin, rangeMax], index) => {
    return (
      acc +
      (coWeights[index] *
        (Math.min(Math.max(co, rangeMin), rangeMax) - rangeMin)) /
        (rangeMax - rangeMin)
    );
  }, 0);
  const temperatureScore = temperatureRanges.reduce(
    (acc, [rangeMin, rangeMax], index) => {
      return (
        acc +
        (temperatureWeights[index] *
          (Math.min(Math.max(temperature, rangeMin), rangeMax) - rangeMin)) /
          (rangeMax - rangeMin)
      );
    },
    0
  );

  // Calculate weighted average of scores
  const weightedSum = pm25Score + humidityScore + coScore + temperatureScore;
  const totalWeight =
    pm25Weights.reduce((acc, val) => acc + val) +
    humidityWeight +
    coWeights.reduce((acc, val) => acc + val) +
    temperatureWeights.reduce((acc, val) => acc + val);
  const aqi = Math.round((weightedSum / totalWeight) * 100);

  // Ensure AQI is within the range of 0 to 100
  return Math.max(0, Math.min(aqi, 100));
}

export function getIcon(title: string, value: number): JSX.Element {
  switch (title) {
    case "PM 2.5 Level":
      if (value >= 0 && value < 12) {
        return Icons.PM_smile({ width: 40, height: 40 });
      } else if (value >= 12 && value <= 35) {
        return Icons.PM_natural({ width: 40, height: 40 });
      } else {
        return Icons.PM_mask({ width: 24, height: 24 });
      }
    case "Temperature":
      if (value >= 0 && value <= 25)
        return Icons.cold({ width: 40, height: 40 });
      else return Icons.fire({ width: 40, height: 40 });

    case "Humidity Level":
      if (value < 50) return Icons.desert({ width: 40, height: 40 });
      else return Icons.water({ width: 40, height: 40 });
    case "Carbonmonoxide Level":
      if (value < 35) return Icons.smile({ width: 40, height: 40 });
      else return Icons.car({ width: 40, height: 40 });
    default:
      return Icons.fire();
  }
}

export const TIME_PER_DATA = [
  {
    label: "1D",
    time: 24 * 60 * 60,
  },
  {
    label: "6H",
    time: 6 * 60 * 60,
  },
  {
    label: "1H",
    time: 60 * 60,
  },
];

export function getTimeString(time: number) {
  const date = new Date(time * 1000);
  return (
    date.toLocaleDateString("th-TH") +
    " " +
    date.toLocaleTimeString("th-TH").split(":").slice(0, 2).join(":")
  );
}

const TIME_STEP = 10 * 60;

export function getLabels(timeRange: number) {
  const timeTo = Math.floor(Date.now() / 1000);
  const timeFrom = timeTo - timeRange;
  const labels = Array(Math.floor(timeRange / TIME_STEP))
    .fill(0)
    .map((_, i) => {
      const date = new Date((timeFrom + i * TIME_STEP) * 1000);
      return (
        date.toLocaleDateString("th-TH") +
        " " +
        date.toLocaleTimeString("th-TH").split(":").slice(0, 2).join(":")
      );
    });
  return labels;
}

export function getSign(title: string): string {
  switch (title) {
    case "PM 2.5 Level":
      return "µg/m3";
    case "Temperature":
      return "°C";
    case "Humidity Level":
      return "%";
    case "Carbonmonoxide Level":
      return "PPM";
    default:
      return "";
  }
}

// * For graph range
export function dataFreqAQI(data: AQIData, interval: number): AQIData {
  const groupedData = new Map();
  const fileteredData = data.filter((item) => !isNaN(item.AQI));
  fileteredData.forEach((item) => {
    const date = new Date(item.date);
    let key;

    switch (interval) {
      case 1: // 1 hour
        key = String(
          date.getMonth() +
            1 +
            "/" +
            date.getDate() +
            "/" +
            date.getFullYear() +
            " " +
            date.getHours() +
            ":00:00"
        );
        break;
      case 2: // 6 hours
        key = String(
          date.getMonth() +
            1 +
            "/" +
            date.getDate() +
            "/" +
            date.getFullYear() +
            " " +
            Math.floor(date.getHours() / 6) * 6 +
            ":00:00"
        );
        break;
      case 3: // 1 day
        key = String(
          date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
        );
        break;
      default:
        key = String(
          date.getMonth() +
            1 +
            "/" +
            date.getDate() +
            "/" +
            date.getFullYear() +
            " " +
            date.getHours() +
            ":00:00"
        );
        break;
    }

    if (!groupedData.has(key)) {
      groupedData.set(key, { ...item, count: 1 });
    } else {
      const existing = groupedData.get(key);
      groupedData.set(key, {
        date: key,
        AQI: item.AQI + existing.AQI,
        count: existing.count + 1,
      });
    }
  });

  const averagedData: AQIData = Array.from(groupedData.values()).map(
    (item) => ({
      date: String(item.date),
      AQI: item.AQI / item.count,
    })
  );
  return averagedData;
}

export function dataFreq(data: SensorData, interval: number): SensorData {
  const groupedData = new Map();
  const filteredData = data.filter(
    (item) => !isNaN(item.temperature && item.pm25 && item.humidity && item.co)
  );

  filteredData.forEach((item) => {
    const date = new Date(item.date);
    let key;

    switch (interval) {
      case 1: // 1 hour
        key = String(
          date.getMonth() +
            1 +
            "/" +
            date.getDate() +
            "/" +
            date.getFullYear() +
            " " +
            date.getHours() +
            ":00:00"
        );
        break;
      case 2: // 6 hours
        key = String(
          date.getMonth() +
            1 +
            "/" +
            date.getDate() +
            "/" +
            date.getFullYear() +
            " " +
            Math.floor(date.getHours() / 6) * 6 +
            ":00:00"
        );
        break;
      case 3: // 1 day
        key = String(
          date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
        );
        break;
      default:
        key = String(
          date.getMonth() +
            1 +
            "/" +
            date.getDate() +
            "/" +
            date.getFullYear() +
            " " +
            date.getHours() +
            ":00:00"
        );
        break;
    }

    if (!groupedData.has(key)) {
      groupedData.set(key, { ...item, count: 1 });
    } else {
      const existing = groupedData.get(key);
      groupedData.set(key, {
        date: key,
        pm25: existing.pm25 + item.pm25,
        humidity: Number(existing.humidity) + Number(item.humidity),
        co: Number(existing.co) + Number(item.co),
        temperature: Number(existing.temperature) + Number(item.temperature),
        count: existing.count + 1,
      });
    }
  });

  // Calculate the average for each interval
  const averagedData: SensorData = Array.from(groupedData.values()).map(
    (item) => ({
      date: item.date,
      pm25: item.pm25 / item.count,
      humidity: item.humidity / item.count,
      co: item.co / item.count,
      temperature: item.temperature / item.count,
    })
  );
  return averagedData;
}

export function getDayOfWeek(date: Date): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getUTCDay()];
}

export function AQITrend(
  data: AQIData,
  date: Date | undefined
): { date: string; AQI: number }[] {
  const weekTrend: { date: string; AQI: number }[] = [];
  const { startOfWeek, endOfWeek } = getWeekRange(date);
  for (
    let d = new Date(startOfWeek);
    d <= endOfWeek;
    d.setDate(d.getDate() + 1)
  ) {
    weekTrend.push({
      date: format(d, "EEEE, dd MMM yyyy"),
      AQI: -1,
    });
  }

  // Update the AQI values based on the input data
  data.forEach((entry) => {
    const entryDate = new Date(entry.date);
    if (entryDate >= startOfWeek && entryDate <= endOfWeek) {
      const index = entryDate.getDate() - startOfWeek!.getDate();
      weekTrend[index].AQI = entry.AQI;
    }
  });

  return weekTrend;
}
