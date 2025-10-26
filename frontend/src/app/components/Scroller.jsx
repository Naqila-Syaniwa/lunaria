import { Postcard} from './Postcard'

// ----- KOMPONEN SCROLLER -----
export function PostcardScroller({ direction = 'left', cards }) {
  const scrollAnimation =
    direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'

  const repeatedData = cards.concat(cards)

  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear_gradient(to_right,transparent_0,_black_48px,_black_calc(100%-48px),transparent_100%)] md:[mask-image:_linear_gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
      <ul
        className={`flex items-center justify-center md:justify-start [&_li]:mx-2 md:[&_li]:mx-4 ${scrollAnimation}`}
      >
        {repeatedData.map((card, index) => (
          <li key={`${card.id}-${index}`}>
            <Postcard 
              to={card.to} 
              from={card.from} 
              message={card.message} 
              flowerImage={card.flowerImage} 
            />
          </li>
        ))}
      </ul>
    </div>
  )
}