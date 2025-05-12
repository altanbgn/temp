import React from 'react'
import axios from 'axios'
import { ChevronDown } from 'lucide-react'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from './components/input'
import { Selector } from './components/form-selector'
import {
  COLOR,
  COLOR_INSIDE,
  COMPANY_NAMES,
  DRIVE_TRAIN,
  ENGINE_TYPE,
  GEAR,
  PLATE_NUMBER_CONDITION,
  STEERING_WHEEL_SIDE,
  TYPE
} from './constants'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './components/form'

const REQUIRED_MESSAGE = "Та энэ хүснэгтийг заавал бөглөнө үү!"

const formInputsSchema = z.object({
  plate_number_condition: z
    .enum(PLATE_NUMBER_CONDITION, { required_error: REQUIRED_MESSAGE }),
  type: z
    .enum(TYPE, { required_error: REQUIRED_MESSAGE }),
  door: z
    .enum(['2', '3', '4', '5', '6'], {
      required_error: REQUIRED_MESSAGE,
      invalid_type_error: "Зөвхөн [2, 3, 4, 5, 6] гэсэн утгуудаас өгнө үү",
      errorMap: () => { return { message: "Зөвхөн [2, 3, 4, 5, 6] гэсэн утгуудаас өгнө үү" } }
    }),
  steering_wheel_side: z
    .enum(STEERING_WHEEL_SIDE, { required_error: REQUIRED_MESSAGE }),
  drivetrain: z
    .enum(DRIVE_TRAIN, { required_error: REQUIRED_MESSAGE }),
  manufactured_year: z
    .coerce
    .number({ required_error: REQUIRED_MESSAGE })
    .gte(1900, { message: 'Утга 1900 ээс их байх ёстой' })
    .lte(2100, { message: 'Утга 2100 аас бага байх ёстой' }),
  imported_year: z
    .coerce
    .number({ required_error: REQUIRED_MESSAGE })
    .gte(1900, { message: 'Утга 1900 ээс их байх ёстой' })
    .lte(2100, { message: 'Утга 2100 аас бага байх ёстой' }),
  engine_type: z
    .enum(ENGINE_TYPE, { required_error: REQUIRED_MESSAGE }),
  motor_capacity: z
    .coerce
    .number({ required_error: REQUIRED_MESSAGE }),
  gear: z
    .enum(GEAR, { required_error: REQUIRED_MESSAGE }),
  color: z
    .enum(COLOR, { required_error: REQUIRED_MESSAGE }),
  color_inside: z
    .enum(COLOR_INSIDE, { required_error: REQUIRED_MESSAGE }),
  km_age: z
    .coerce
    .number({ required_error: REQUIRED_MESSAGE }),
  model: z
    .string({ required_error: REQUIRED_MESSAGE }),
  company: z
    .enum(COMPANY_NAMES, { required_error: REQUIRED_MESSAGE })
})

type FormInputs = z.infer<typeof formInputsSchema>

export default function App() {
  const form = useForm({
    resolver: zodResolver(formInputsSchema),
    mode: 'onBlur',

  })

  const [value, setValue] = React.useState<number>(0)
  const [error, setError] = React.useState<string | null>('')

  const handleSubmit = (values: FormInputs) => {
    axios.post(import.meta.env.VITE_API_URL + '/car/predict', {
      ...values,
      door: parseInt(values.door)
    })
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
              <Selector name='company' label={'Компани'} constant={COMPANY_NAMES} />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{'Модел'}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Prius 20 | Crown гэх мэт'
                        {...field}
                        required
                      />
                    </FormControl>
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
                name="door"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{'Хаалга'}</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                  <FormItem>
                    <FormLabel>{'Мотор багтаамж'}</FormLabel>
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
              <button type='submit' className='col-span-2 p-2 bg-red-400 hover:bg-red-500 rounded-xl text-white shadow-lg cursor-pointer transition-all duration-200'>
                {'Илгээх'}
              </button>
            </form>
          </Form>
        </div>
        <div className='max-h-full min-h-svh md:auto bg-red-400 md:rounded-tl-full md:rounded-bl-full flex justify-center items-center p-8 md:p-0' id='result'>
          <div className='w-[500px] flex flex-col gap-4'>
            <p className='text-white font-bold'>{'Тооцоолсон үнэ:'}</p>
            <p className='text-6xl md:text-6xl text-white font-black'>{value.toLocaleString() + '₮'}</p>
            {error && <span className='bg-amber-200 rounded-full px-4 py-1'>{error}</span>}
          </div>
        </div>
      </div>
    </div >
  )
}
