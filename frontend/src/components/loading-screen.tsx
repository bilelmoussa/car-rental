import { Spinner } from "./ui/shadcn-io/spinner"

export function LoadingScreen() {
  return (
    <div className='flex h-screen w-full'>
      <div className='flex justify-center items-center w-full'>
        <Spinner />
      </div>
    </div>
  )
}
