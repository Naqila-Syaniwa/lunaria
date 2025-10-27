import Image from 'next/image';

// ----- KOMPONEN KARTU -----
export function Postcard({ to, from, message, flowerImage }) {
  return (
    <div className="w-[350px] h-[177px] md:w-[481px] md:h-[243px] bg-card-border rounded-[20px] p-1.5 flex-shrink-0">
      <div className="w-full h-full bg-card-inner rounded-2xl p-4 md:p-6 relative font-pixel text-card-text text-base md:text-lg">
        <div className="absolute top-4 right-4 w-12 h-12 md:top-6 md:right-6 md:w-16 md:h-16 bg-card-border rounded-lg flex items-center justify-center p-1">
          <Image
            src={flowerImage} 
            alt="Pixel Flower"
            width={90}
            height={87}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-3 md:gap-4 pr-20 md:pr-24">
            <p>To: {to}</p>
            <p>
              {message}
            </p>
          </div>
          <p className="absolute bottom-4 right-4 md:bottom-6 md:right-6">-{from}</p>
        </div>
      </div>
    </div>
  )
}