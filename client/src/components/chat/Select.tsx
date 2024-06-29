import { Combobox } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";

const Select: React.FC<{
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: { value: string; label: string }) => void;
  placeholder: string;
}> = ({ options, value, placeholder, onChange }) => {
  const [localOptions, setLocalOptions] = useState<typeof options>([]);

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  return (
    <Combobox
      as="div"
      className="w-full"
      value={options.find((o) => o.value === value)}
      onChange={(val: any) => onChange(val)}
    >
      <div className="relative mt-2">
        <Combobox.Button className="w-full">
          <Combobox.Input
            placeholder={placeholder}
            className="lock w-full rounded-xl border-0 py-4 px-5 bg-purple-600/90 outlin outline-[1px] outline-purple-400 text-white font-light placeholder:text-white/70 focus:ring-[1px] focus:ring-white"
            onChange={(e) => {
              setLocalOptions(
                options.filter((op) => op.label.includes(e.target.value))
              );
            }}
            displayValue={(option: (typeof options)[0]) => option?.label}
          />
        </Combobox.Button>
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-6 w-6 text-purple-400" aria-hidden />
        </Combobox.Button>

        {localOptions.length > 0 && (
          <Combobox.Options className="outline outline-[1px] outline-white absolute z-10 mt-2 p-1 max-h-60 w-full overflow-auto rounded-xl bg-purple-500 text-base shadow-lg ring-opacity-5 focus:outline-none sm:text-sm">
            {localOptions.map((option) => (
              <Combobox.Option
                key={option.value}
                value={option}
                className={({ active }) =>
                  `${
                    active ? "bg-purple-600" : "bg-purple-400"
                  } text-white cursor-pointer relative rounded-2xl select-none py-4 pl-3 pr-9 m-1`
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={`${
                        selected ? "font-semibold" : ""
                      } block truncate`}
                    >
                      {option.label}
                    </span>

                    {selected && (
                      <span
                        className={`${
                          active ? "text-white" : "text-purple-600"
                        } absolute inset-y-0 right-0 flex items-center pr-4`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
};

export default Select;
