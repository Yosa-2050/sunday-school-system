import {
    CheckIcon,
    Combobox,
    Group,
    Input,
    Pill,
    PillsInput,
    useCombobox,
} from '@mantine/core';

interface MultiSelectPillsProps {
    data: string[] | { label: string; value: string }[];
    value: string[];
    onChange: (value: string[]) => void;
    item?: string;
    maxDisplayedValues?: number;
    placeholder?: string;
}

export function MultiSelectPills({
    data,
    item,
    value,
    onChange,
    maxDisplayedValues = 2,
    placeholder = 'Pick one or more values',
}: MultiSelectPillsProps) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const handleValueSelect = (val: string) => {
        const newValue = value.includes(val)
            ? value.filter((v) => v !== val)
            : [...value, val];
        onChange(newValue);
    };

    const handleValueRemove = (val: string) => {
        const newValue = value.filter((v) => v !== val);
        onChange(newValue);
    };

    const values = value
        .slice(
            0,
            maxDisplayedValues === value.length
                ? maxDisplayedValues
                : maxDisplayedValues - 1,
        )
        .map((item) => (
            <Pill
                key={item}
                withRemoveButton
                onRemove={() => handleValueRemove(item)}
            >
                {item}
            </Pill>
        ));

    const options = data.map((item) => {
        const _label = typeof item === 'string' ? item : item.label;
        const _value = typeof item === 'string' ? item : item.value;

        return (
            <Combobox.Option
                value={_value}
                key={_value}
                active={value.includes(_value)}
            >
                <Group gap="sm">
                    {value.includes(_value) ? <CheckIcon size={12} /> : null}
                    <span>{_label}</span>
                </Group>
            </Combobox.Option>
        );
    });

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={handleValueSelect}
            withinPortal={false}
        >
            <Combobox.DropdownTarget>
                <PillsInput pointer onClick={() => combobox.toggleDropdown()}>
                    <Pill.Group>
                        {value.length > 0 ? (
                            <>
                                {values}
                                {value.length > maxDisplayedValues && (
                                    <Pill>
                                        +
                                        {value.length -
                                            (maxDisplayedValues - 1)}{' '}
                                        `${item} more`
                                    </Pill>
                                )}
                            </>
                        ) : (
                            <Input.Placeholder>{placeholder}</Input.Placeholder>
                        )}

                        <Combobox.EventsTarget>
                            <PillsInput.Field
                                type="hidden"
                                onBlur={() => combobox.closeDropdown()}
                                onKeyDown={(event) => {
                                    if (event.key === 'Backspace') {
                                        event.preventDefault();
                                        handleValueRemove(
                                            value[value.length - 1] as string,
                                        );
                                    }
                                }}
                            />
                        </Combobox.EventsTarget>
                    </Pill.Group>
                </PillsInput>
            </Combobox.DropdownTarget>

            <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}
