import Image from 'next/image';

export default function AuthCard({
                                   image,
                                   children
                                 }) {
  return (
      <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto shadow-xl rounded">
        <div>
          {image && (
              <Image
                  src={image}
                  alt="Auth illustration"
                  width={400}
                  height={400}
                  className="object-fit object-cover rounded h-full w-full"
              />
          )}
        </div>
        <div>
          {children}
        </div>
      </div>
  );
}