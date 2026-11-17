import Demo from "../examples/form-demo";

export const defaultProps = {
  defaultEmail: "",
  required: true,
  submitLabel: "Submit",
} satisfies { defaultEmail: string; required: boolean; submitLabel: string };

export default function FormPlaygroundExample(
  args: { defaultEmail: string; required: boolean; submitLabel: string } = defaultProps,
) {
  return <Demo key={args.defaultEmail} {...args} />;
}
