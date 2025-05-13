import React from 'react'
import axios from 'axios'
import { Check, ChevronDown, ChevronsUpDown } from 'lucide-react'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Input } from './components/input'
import { Selector } from './components/form-selector'
import {
  COLOR,
  COLOR_INSIDE,
  COMPANY_MODEL_NAMES,
  DRIVE_TRAIN,
  ENGINE_TYPE,
  GEAR,
  PLATE_NUMBER_CONDITION,
  STEERING_WHEEL_SIDE,
  TYPE
} from './constants'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './components/form'
import { Popover, PopoverContent, PopoverTrigger } from './components/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './components/command'
import { Button } from './components/button'
import { cn } from './components/utils'

const REQUIRED_MESSAGE = "Та энэ хүснэгтийг заавал бөглөнө үү!"
const MUST_BE_NUMBER = "Та тоон утга оруулна уу!"

const formInputsSchema = z.object({
  company: z
    .string({ required_error: REQUIRED_MESSAGE }),
  model: z
    .string({ required_error: REQUIRED_MESSAGE }),
  plate_number_condition: z
    .enum(PLATE_NUMBER_CONDITION, { required_error: REQUIRED_MESSAGE }),
  type: z
    .enum(TYPE, { required_error: REQUIRED_MESSAGE }),
  door: z
    .coerce
    .number({ required_error: REQUIRED_MESSAGE })
    .gte(2, { message: "2-оос 6-ын хооронд утга оруулна уу!" })
    .lte(6, { message: "2-оос 6-ын хооронд утга оруулна уу!" }),
  steering_wheel_side: z
    .enum(STEERING_WHEEL_SIDE, { required_error: REQUIRED_MESSAGE }),
  drivetrain: z
    .enum(DRIVE_TRAIN, { required_error: REQUIRED_MESSAGE }),
  manufactured_year: z
    .coerce
    .number({ required_error: REQUIRED_MESSAGE, invalid_type_error: MUST_BE_NUMBER })
    .gte(1900, { message: 'Утга 1900 ээс их байх ёстой' })
    .lte(2100, { message: 'Утга 2100 аас бага байх ёстой' }),
  imported_year: z
    .coerce
    .number({ required_error: REQUIRED_MESSAGE, invalid_type_error: MUST_BE_NUMBER })
    .gte(1900, { message: 'Утга 1900 ээс их байх ёстой' })
    .lte(2100, { message: 'Утга 2100 аас бага байх ёстой' }),
  engine_type: z
    .enum(ENGINE_TYPE, { required_error: REQUIRED_MESSAGE }),
  motor_capacity: z
    .coerce
    .number({ required_error: REQUIRED_MESSAGE, invalid_type_error: MUST_BE_NUMBER }),
  gear: z
    .enum(GEAR, { required_error: REQUIRED_MESSAGE }),
  color: z
    .enum(COLOR, { required_error: REQUIRED_MESSAGE }),
  color_inside: z
    .enum(COLOR_INSIDE, { required_error: REQUIRED_MESSAGE }),
  km_age: z
    .coerce
    .number({ required_error: REQUIRED_MESSAGE, invalid_type_error: MUST_BE_NUMBER }),
})

type FormInputs = z.infer<typeof formInputsSchema>

export default function App() {
  const form = useForm({
    resolver: zodResolver(formInputsSchema),
    mode: 'onBlur',
  })

  const [value, setValue] = React.useState<number>(0)
  const [error, setError] = React.useState<string | null>('')

  const [selectedCompanyModels, setSelectedCompanyModels] = React.useState<any>([])

  const handleSubmit = (values: FormInputs) => {
    axios.post(import.meta.env.VITE_API_URL + '/car/predict', values)
      .then((res) => {
        setValue(res.data?.price)
        setError(null)
      })
      .catch((err) => {
        if (err?.response) {
          setError(err?.response?.data?.error_msg || 'Алдаа гарлаа')
        } else {
          setError('Алдаа гарлаа')
        }
      })
      .finally(() => {
        document.querySelector('#result')?.scrollIntoView()
      })
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='h-svh flex flex-col justify-center items-center gap-8 relative'>
        <div className='flex flex-col justify-center items-center gap-4'>
          <span className='text-8xl animate__animated animate__lightSpeedInRight'>
            {'🚗'}
          </span>
          <h1 className='text-lg md:text-2xl font-light animate__animated animate__fadeIn animate__delay-1s whitespace-nowrap'>
            {'Автомашины скоринг тооцоолох систем'}
          </h1>
        </div>
        <a href='#form' className='absolute bottom-16 &:svg:stroke-white animate__animated animate__fadeIn animate__delay-2s'>
          <div className='animate-bounce flex flex-col justify-center items-center'>
            <p>{'Эхлэх'}</p>
            <ChevronDown width={64} />
          </div>
        </a>
      </div>
      <div className='h-svh w-full grid grid-cols-1 md:grid-cols-2 items-between mt-16' id='form'>
        <div className='flex justify-center items-center'>
          <Form {...form}>
            <form
              className='w-[500px] flex flex-col md:grid md:grid-cols-2 gap-3 p-8 md:p-0'
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <h1 className='text-2xl md:text-3xl col-span-2 font-bold mb-6'>
                {'Бөглөх талбар'}
              </h1>
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>{'Компани'}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            size='sm'
                            className={cn(
                              "bg-transparent border-input hover:bg-transparent hover:text-muted-foreground justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? COMPANY_MODEL_NAMES.find(
                                (item: any) => item.company === field.value
                              )?.company
                              : "Сонгох"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] border-input p-0" align='start'>
                        <Command>
                          <CommandInput
                            placeholder="Компани хайх..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>{'Компани олдсонгүй.'}</CommandEmpty>
                            <CommandGroup>
                              {COMPANY_MODEL_NAMES.map((item: any) => (
                                <CommandItem
                                  value={item.company}
                                  key={item.company}
                                  className='hover:bg-orange-400'
                                  onSelect={() => {
                                    form.setValue("company", item.company as any)
                                    form.setValue("model", '')
                                    setSelectedCompanyModels(item.models)
                                  }}
                                >
                                  {item.company}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      item.company === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>{'Модел'}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            size='sm'
                            className={cn(
                              "bg-transparent border-input hover:bg-transparent hover:text-muted-foreground justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? (selectedCompanyModels || []).find((item: any) => item === field.value)
                              : "Сонгох"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] border-input p-0" align='start'>
                        <Command>
                          <CommandInput
                            placeholder="Модел хайх..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>{'Модел олдсонгүй.'}</CommandEmpty>
                            <CommandGroup>
                              {(selectedCompanyModels || []).map((item: any) => (
                                <CommandItem
                                  value={item}
                                  key={item}
                                  onSelect={() => form.setValue("model", item as any)}
                                >
                                  {item}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      item === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Selector
                name='plate_number_condition'
                label={'Нөхцөл'}
                constant={PLATE_NUMBER_CONDITION}
              />
              <Selector
                name='type'
                label={'Төрөл'}
                constant={TYPE}
              />
              <Selector
                name='steering_wheel_side'
                label={'Хүрд'}
                constant={STEERING_WHEEL_SIDE}
              />
              <Selector
                name='engine_type'
                label={'Хөдөлгүүр'}
                constant={ENGINE_TYPE}
              />
              <Selector
                name='drivetrain'
                label={'Хөтлөгч'}
                constant={DRIVE_TRAIN}
              />
              <Selector
                name='gear'
                label={'Хурдны хайрцаг'}
                constant={GEAR}
              />
              <Selector
                name='color'
                label={'Өнгө'}
                constant={COLOR}
              />
              <Selector
                name='color_inside'
                label={'Дотор өнгө'}
                constant={COLOR_INSIDE}
              />
              <FormField
                control={form.control}
                name="manufactured_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{'Үйлдвэрлэсэн он'}</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        pattern="\d{4}"
                        placeholder='20xx'
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imported_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{'Орж ирсэн он'}</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='20xx'
                        pattern="\d{4}"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="door"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{'Хаалга'}</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='5' {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="km_age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{'Явсан км'}</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='123456789'
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="motor_capacity"
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>{'Мотор багтаамж (Л)'}</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step={0.1}
                        placeholder='1.2'
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='col-span-2 bg-orange-300 hover:bg-orange-400 text-white cursor-pointer transition-all duration-200'>
                {'Илгээх'}
              </Button>
            </form>
          </Form>
        </div>
        <div className='max-h-full min-h-svh md:auto bg-orange-300 rounded-full flex justify-center items-center p-8 md:p-0' id='result'>
          <div className='flex flex-col justify-center items-center gap-4'>
            <p className='text-white font-bold'>{'Тооцоолсон үнэ:'}</p>
            <p className='text-6xl md:text-6xl text-white font-black'>{value.toLocaleString() + '₮'}</p>
            {error && <span className='bg-amber-200 rounded-full px-4 py-1'>{error}</span>}
          </div>
        </div>
      </div>
    </div >
  )
}
