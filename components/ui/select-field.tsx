type SelectFieldProps = {
  id: string
  label: string
  value: string
  placeholder: string
  options: SelectOption[]
  disabled?: boolean
  onChange: (value: string) => void
}

export type SelectOption = {
  label: string
  value: string
}

export function SelectField({
  id,
  label,
  value,
  placeholder,
  options,
  disabled = false,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-muted-foreground"
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
