import GaugeChart from "./Gauge.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DataBox({parameter, value, unit, max, data = [] }){
  let status = "Normal";

  if (value > max/3 && value <= max*2/3) {
    status = "Little high";
  } else if (value > max*2/3) {
    status = "High";
  }
  return (
    <div className="p-4 rounded-2xl m-10 w-99 ring flex-wrap border border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-gray-300 text-2xl font-bold tracking-wide">
          {parameter}
        </h2>
        <div>
          <p className="text-5xl font-semibold">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{unit}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">

        <div className="w-32">
          <GaugeChart
            value={value}
            text={status}
            max={max}
            id="turbidity-gauge"
            colors={["#00C49F", "#FFB347", "#FF6347"]}
            percent={Math.min(value / 20, 1)}
            hideText={true}
            arcsWidth={[0.3, 0.3, 0.3]}
          />
        </div>
      </div>

      <div className="mt-4 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" stroke="#555" tick={{ fontSize: 10 }} />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1C1F26",
                border: "none",
                color: "#fff",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#FFB347"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}