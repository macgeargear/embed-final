import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import React from "react";

type Props = {
  level: string;
  desc: string;
};

export default function AQIDescriptionCard({ level, desc }: Props) {
  return (
    <Popover>
      <PopoverButton className="text-sm/6 text-start font-semibold focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
        {level}
      </PopoverButton>
      <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel
          anchor="bottom"
          className="p-4 max-w-xs rounded-xl bg-white text-sm/6 [--anchor-gap:var(--spacing-5)] border"
        >
          {desc}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
