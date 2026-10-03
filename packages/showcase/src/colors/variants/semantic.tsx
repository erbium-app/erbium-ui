import { semanticColors, tagColors, softColors } from "../helpers";

const Example = () => (
  <div className="grid max-w-2xl gap-8">
    <section className="grid gap-3">
      <h2 className="text-sm font-medium">Semantic colors</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {semanticColors.map(([name, colors]) => (
          <div key={name} className={`rounded-lg p-3 text-sm font-medium ${colors}`}>
            {name}
          </div>
        ))}
      </div>
    </section>
    <section className="grid gap-3">
      <h2 className="text-sm font-medium">Soft semantic colors</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {softColors.map(([name, colors]) => (
          <div key={name} className={`rounded-lg p-3 text-sm font-medium ${colors}`}>
            {name}
          </div>
        ))}
      </div>
    </section>
    <section className="grid gap-3">
      <h2 className="text-sm font-medium">Categorical tag colors</h2>
      <div className="flex flex-wrap gap-2">
        {tagColors.map(([name, colors]) => (
          <span key={name} className={`rounded-full px-2.5 py-1 text-xs font-medium ${colors}`}>
            {name}
          </span>
        ))}
      </div>
    </section>
  </div>
);

export default Example;
