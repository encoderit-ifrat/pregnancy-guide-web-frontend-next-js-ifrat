import Image from 'next/image';

export default function AuthCard({
                                   image,
                                   children
                                 }) {
  return (
      <div className="mb-10 sm:my-10 grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto shadow-xl rounded">
        <div>
          {image && (
              <Image
                  src={image}
                  alt="Auth illustration"
                  width={400}
                  height={400}
                  className="object-fit object-cover object-[0_30%] rounded max-h-60 md:max-h-full md:h-full w-full"
              />
          )}
        </div>
        <div className="max-w-[400px] sm:w-full mx-auto">
          {children}
        </div>
      </div>
  );
}