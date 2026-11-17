import { RadarChart } from "@erbium/ui/charts/radar-chart";
import { players, skills } from "../examples/data";

const Example = (args: { legend: boolean; points: boolean; rings: number; tooltip: boolean }) => (
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

export default Example;
