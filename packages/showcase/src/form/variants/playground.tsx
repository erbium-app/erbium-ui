import Demo from "../examples/form-demo";

const Example = (args: { defaultEmail: string; required: boolean; submitLabel: string }) => (
  <Demo key={args.defaultEmail} {...args} />
);

export default Example;
