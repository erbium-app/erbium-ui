import { RadarChart } from "@erbium/ui/charts/radar-chart";
import { players, skills } from "../examples/data";

export const defaultProps = {
  legend: true,
  points: false,
  rings: 4,
  tooltip: true,
} satisfies { legend: boolean; points: boolean; rings: number; tooltip: boolean };

export default function RadarChartPlaygroundExample(
  args: { legend: boolean; points: boolean; rings: number; tooltip: boolean } = defaultProps,
) {
  return (
    <div className="w-md max-w-full p-4">
      <RadarChart
        ariaLabel="Skill ratings for two players"
        data={skills}
        index="skill"
        series={players}
        max={100}
        initialWidth={400}
        {...args}
      />
    </div>
  );
}
