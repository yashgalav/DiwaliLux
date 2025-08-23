import type { ChangeEvent } from "react"

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  max?: number; // number of characters
  digitsOnly?: boolean;
}

export default function LabelledInput({
  label,
  placeholder,
  onChange,
  type = "text",
  max,
  digitsOnly
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-orange-500">
        {label}
      </label>
      <input
        onChange={onChange}
        onInput={(e) => {
          const input = e.target as HTMLInputElement;
          let value = input.value;

          // Only allow digits if specified
          if (digitsOnly) {
            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
          }

          // Limit to max length if specified
          if (max) {
            value = value.slice(0, max);
          }

          input.value = value;
        }}
        type= {type || "text" }// force text type for control
        inputMode={type === "number" ? "numeric" : undefined} // mobile numeric keyboard
        maxLength={max} // works for text inputs
        className="bg-amber-50 border border-amber-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-2 focus:border-amber-500 outline-none block w-full p-2.5"
        placeholder={placeholder}
        aria-required={true}
      />
    </div>
  );
}
