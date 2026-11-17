import { useState } from "react";
import { StepIndicator, StepIndicatorItem } from "@erbium/ui/blocks/step-indicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";

const tabs = ["Source", "Build", "Deploy"];

export default function StepIndicatorTabsExample() {
  const [index, setIndex] = useState(0);

  return (
    <div className="flex w-80 flex-col items-center gap-4">
      <Tabs
        value={tabs[index]}
        onValueChange={(value) => {
          setIndex(tabs.indexOf(String(value)));
        }}
      >
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab} value={tab} className="py-4 text-center text-muted-foreground">
            {tab} settings
          </TabsContent>
        ))}
      </Tabs>
      <StepIndicator value={index} onValueChange={setIndex} aria-label="Pipeline steps">
        {tabs.map((tab, i) => (
          <StepIndicatorItem key={tab} index={i} label={tab} />
        ))}
      </StepIndicator>
    </div>
  );
}
