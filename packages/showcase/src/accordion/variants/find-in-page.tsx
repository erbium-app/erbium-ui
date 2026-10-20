import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@erbium/ui/components/accordion";

const FindInPageExample = () => (
  <div className="grid w-80 max-w-full gap-group">
    <p className="text-caption text-muted-foreground">
      Use browser Find to search for “workspace recovery”. Matching a closed panel reveals its
      content in browsers that support hidden-until-found.
    </p>
    <Accordion>
      <AccordionItem value="recovery">
        <AccordionTrigger>How do I restore my workspace?</AccordionTrigger>
        <AccordionContent hiddenUntilFound>
          Workspace recovery restores your saved projects and preferences. Review the restored
          project before continuing your work.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="sharing">
        <AccordionTrigger>How do I share a project?</AccordionTrigger>
        <AccordionContent hiddenUntilFound>
          Invite a teammate from the project actions menu and choose the appropriate access.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="disabled" disabled>
        <AccordionTrigger>Managed by your organization</AccordionTrigger>
        <AccordionContent>This setting is unavailable.</AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

export default FindInPageExample;
