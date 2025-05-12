import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./select"

export function Selector({
  name = '',
  label = '',
  constant = [],
}: {
  name: string
  label: string
  constant: readonly string[]
}) {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label ?? ''}</FormLabel>
          <Select defaultValue={field.value} onValueChange={field.onChange} required>
            <FormControl>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Сонгох" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {constant.map((item: string) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

