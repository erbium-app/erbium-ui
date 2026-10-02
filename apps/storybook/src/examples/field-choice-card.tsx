import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldItem,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";

export default function FieldChoiceCard() {
  return (
    <div className="w-full max-w-md">
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">Compute Environment</FieldLegend>
          <FieldDescription>Select the compute environment for your cluster.</FieldDescription>
          <Field>
            <RadioGroup defaultValue="kubernetes">
              <FieldItem variant="card" orientation="horizontal">
                <FieldContent>
                  <FieldLabel>Kubernetes</FieldLabel>
                  <FieldDescription>
                    Run GPU workloads on a K8s configured cluster.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="kubernetes" />
              </FieldItem>
              <FieldItem variant="card" orientation="horizontal">
                <FieldContent>
                  <FieldLabel>Virtual Machine</FieldLabel>
                  <FieldDescription>
                    Access a VM configured cluster to run GPU workloads.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="vm" />
              </FieldItem>
            </RadioGroup>
          </Field>
        </FieldSet>
      </FieldGroup>
    </div>
  );
}
