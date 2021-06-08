import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { isMobile } from "react-device-detect";

export default function Responsetime({ dailyResponsetime = [] }) {
  if (isMobile) {
    dailyResponsetime = dailyResponsetime.slice(
      Math.max(dailyResponsetime.length - 30, 0)
    );
  }
  return (
    <ResponsiveContainer height="100%" width="100%" minHeight="100px">
      {dailyResponsetime.length > 0 ? (
        <AreaChart
          width={500}
          height={400}
          data={dailyResponsetime}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="time" hide={true} />
          <Tooltip />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3bd671" stopOpacity={1} />
              <stop offset="100%" stopColor="transparent" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3bd671"
            strokeWidth={3}
            fill="url(#colorUv)"
          />
        </AreaChart>
      ) : (
        <div
          className="ssc-head-line"
          style={{ height: "85px", width: "100%" }}
        ></div>
      )}
    </ResponsiveContainer>
  );
}
