import { Field, inputClass } from "./Form";

interface OneOnOneFieldProps {
  isDoing: boolean;
  onIsDoingChange: (value: boolean) => void;
  withWhom: string;
  onWithWhomChange: (value: string) => void;
}

export default function OneOnOneField({
  isDoing,
  onIsDoingChange,
  withWhom,
  onWithWhomChange,
}: OneOnOneFieldProps) {
  return (
    <>
      <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
        <input
          type="checkbox"
          checked={isDoing}
          onChange={(e) => onIsDoingChange(e.target.checked)}
          className="w-4 h-4"
        />
        Currently doing One2One
      </label>

      {isDoing && (
        <Field label="With whom (optional)">
          <input
            value={withWhom}
            onChange={(e) => onWithWhomChange(e.target.value)}
            className={inputClass}
            placeholder="Name"
          />
        </Field>
      )}
    </>
  );
}
