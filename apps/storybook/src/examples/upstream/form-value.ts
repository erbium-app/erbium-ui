export function getFormValue(formData: FormData, name: string, fallback = "None") {
  const value = formData.get(name);
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

export function getFormValues(formData: FormData, name: string) {
  return formData.getAll(name).filter((value): value is string => typeof value === "string");
}
