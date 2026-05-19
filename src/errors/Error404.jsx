
export default function Err404() {
  return (
    <div className="w-full flex flex-col justify-center items-center text-sm md:text-lg gap-y-6 text-gray-100 font-semibold">
      <div className="w-full items-center flex flex-col gap-y-1 bg-on-primary-container py-4 shadow-md/20 ">
        <div className="text-lg md:text-3xl">ERROR 404</div>
        <div>PAGE NOT FOUND.</div>
      </div>
      <div className="w-full mt-6 text-center items-center">
        <a href="/" className="text-primary-container hover:text-primary-container/50 hover:underline decoration-2 underline-offset-8">
          Go Home page
        </a>
      </div>
    </div>
  );
}
