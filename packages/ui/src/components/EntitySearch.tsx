"use client";

import { CloseButton, TextInput } from "@mantine/core";
import { entityParamSchema } from "@shega/shared";
import { IconSearch } from "@tabler/icons-react";
import { parseAsJson, useQueryState } from "nuqs";
import { useRef, useEffect } from "react"; // Import useEffect
import { useDebouncedCallback } from "use-debounce";
import { cn } from "../utilities/cn";

type EntitySearchProps = {
  entity: string;
  placeholder?: string;
  className?: string;
};

export function EntitySearch({
  placeholder,
  entity,
  className,
}: EntitySearchProps) {
  const ref = useRef<HTMLInputElement>(null);

  const [entityParams, setEntityParams] = useQueryState(
    entity,
    parseAsJson(entityParamSchema.parse)
  );

  // Add useEffect to focus the input on mount
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const handleSearch = useDebouncedCallback((term: string | null) => {
    if (term) {
      setEntityParams({ ...entityParams, p: 1, s: term });
    } else {
      const updatedParams = { ...entityParams };
      updatedParams.s = undefined;
      setEntityParams({ ...updatedParams, p: 1 });
      if (ref?.current) {
        ref.current.value = "";
      }
    }
  }, 300);

  return (
    <TextInput
      ref={ref}
      placeholder={placeholder || "Search..."}
      leftSectionPointerEvents="none"
      leftSection={<IconSearch size={16} />}
      rightSection={
        <CloseButton
          aria-label="Clear input"
          onClick={() => handleSearch(null)}
          style={{
            display: entityParams?.s ? undefined : "none",
          }}
        />
      }
      rightSectionPointerEvents="all"
      onChange={(e) => {
        handleSearch(e.target.value);
      }}
      defaultValue={entityParams?.s}
      className={cn(className, "w-1/3")}
      min={"30%"}
    />
  );
}
