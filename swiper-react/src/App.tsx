import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useReducer,
  forwardRef,
} from "react";
import "./App.css";
import { Autoplay } from "swiper";
import { Swiper, SwiperProps, SwiperSlide, } from "swiper/react";
import { Swiper as SwiperClass } from "swiper/types";
import "swiper/css";


// type --------------------------------------------------------------------------------------
type Slide = string;
type ContentsFn = (slide: Slide, index: number) => JSX.Element;

// constants ---------------------------------------------------------------------------------
const initialAutoPlaySpeed = 5000;

const VIEW_MODE = {
  SINGLE: 'single',
  MULTI: 'multi'
} as const;
type ViewModeTypes = typeof VIEW_MODE[keyof typeof VIEW_MODE]

// static method -----------------------------------------------------------------------------
const setTimeSecond = (time: string): string => (Number(time)/1000).toString() + 's';


// components --------------------------------------------------------------------------------

// autoplay speed second
const Time = forwardRef<HTMLSpanElement>((_, ref) => {
  return <span ref={ref}></span>;
});

// swiper autoplay speed
const Speed = forwardRef<
  HTMLInputElement,
  {
    timeRef: React.MutableRefObject<HTMLSpanElement>;
    onRangeChange: () => void;
  }
>(({ timeRef, onRangeChange }, ref) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input
        type="range"
        step={100}
        min={0}
        max={10000}
        ref={ref}
        onChange={onRangeChange}
      />
      <Time ref={timeRef} />
    </div>
  );
});

// swiper Navigation
const SwiperNav: React.FC<{
  swiperRef: React.MutableRefObject<SwiperClass>;
  slides: Slide[];
  activeIndex: number;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  rangeRef: React.MutableRefObject<HTMLInputElement>;
  timeRef: React.MutableRefObject<HTMLSpanElement>;
  onRangeChange: () => void;
}> = ({
  swiperRef,
  slides,
  activeIndex,
  isPlaying,
  setIsPlaying,
  rangeRef,
  timeRef,
  onRangeChange,
}) => {
  const onFirst = () => swiperRef.current.slideTo(0);
  const onNext = () => swiperRef.current.slideNext();
  const onPrev = () => swiperRef.current.slidePrev();
  const onLast = () => swiperRef.current.slideTo(slides.length);
  const onTo = (index: number) => swiperRef.current.slideTo(index);

  const className = (index:number) => {
    return (index === activeIndex
      ? "active-btn"
      : "not-active-btn") + ` btn-${index}`
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "80%",
        margin: '24px 0 0 0'
      }}
    >
      <button onClick={onFirst} style={{ margin: "0 8px" }}>
        first
      </button>
      <button onClick={onPrev} style={{ margin: "0 8px" }}>
        prev
      </button>
      {slides.length > 0 &&
        slides.length <= 15 &&
        slides.map((slide, index) => (
          <button
            key={slide}
            onClick={() => onTo(index)}
            style={{ margin: "0 8px" }}
            className={className(index)}
          >
            {index + 1}
          </button>
        ))}
      {slides.length > 0 &&
        slides.length > 10 &&
        slides.map((slide, index) => {
          if (activeIndex < 3) {
            if (
              index === 0 ||
              index === activeIndex - 1 ||
              index === activeIndex ||
              index === activeIndex + 1 ||
              index === slide.length
            ) {
              return (
                <button
                  key={slide}
                  onClick={() => onTo(index)}
                  style={{ margin: "0 8px" }}
                  className={className(index)}
                >
                  {index + 1}
                </button>
              );
            }
            if (index === activeIndex - 2 || index === activeIndex + 2) {
              return (
                <div key={slide} style={{ margin: "0 8px" }}>
                  ・・・
                </div>
              );
            }
          } else {
            if (
              index === 0 ||
              index === activeIndex - 2 ||
              index === activeIndex - 1 ||
              index === activeIndex ||
              index === activeIndex + 1 ||
              index === activeIndex + 2 ||
              index === slide.length
            ) {
              return (
                <button
                  key={slide}
                  onClick={() => onTo(index)}
                  style={{ margin: "0 8px" }}
                  className={className(index)}
                >
                  {index + 1}
                </button>
              );
            }
            if (index === activeIndex - 3 || index === activeIndex + 3) {
              return (
                <div key={slide} style={{ margin: "0 8px" }}>
                  ・・・
                </div>
              );
            }
          }
        })}
      <button onClick={onNext} style={{ margin: "0 8px" }}>
        next
      </button>
      <button onClick={onLast} style={{ margin: "0 8px" }}>
        last
      </button>

      {isPlaying ? (
        <button onClick={() => setIsPlaying(false)} style={{ margin: "0 8px" }}>
          stop
        </button>
      ) : (
        <button onClick={() => setIsPlaying(true)} style={{ margin: "0 8px" }}>
          play
        </button>
      )}
      <Speed ref={rangeRef} timeRef={timeRef} onRangeChange={onRangeChange} />
    </div>
  );
};




function App() {

  // state ---------------------------------------------------------------------------------

  const [slides, setSlides] = useReducer(
    (state: Slide[], payload: { type: string; data: Slide }): Slide[] => {
      switch (payload.type) {
        case "set":
          return [...state, payload.data];
        default:
          return [...state];
      }
    },
    [] as Slide[]
  );
  const swiperRef = useRef<SwiperClass>({} as SwiperClass);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const fistRenderCancelRef = useRef<boolean>(true);
  const timeRef = useRef<HTMLSpanElement>({} as HTMLSpanElement);
  const rangeRef = useRef<HTMLInputElement>({} as HTMLInputElement);

  const [viewMode, setViewMode] = useState<ViewModeTypes>(VIEW_MODE.SINGLE)


  // method --------------------------------------------------------------------------------

  const onRangeChange = (): void => {
    timeRef.current.innerHTML = setTimeSecond(rangeRef.current.value);
  };

  /**
   * swiper create
   */
  const createSwiperComp = useCallback(
    (swiperConf: SwiperProps, contentsFn: ContentsFn) => {
      return (
        <Swiper
          centeredSlides={true}
          modules={[Autoplay]}
          autoplay={{ delay: Number(rangeRef.current.value) ?? initialAutoPlaySpeed }}
          onSlideChange={() => setActiveIndex(swiperRef.current.activeIndex)}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            swiper.autoplay.stop();
            timeRef.current.innerHTML = setTimeSecond(rangeRef.current.value);
          }}
          onAutoplayStop={e => console.log('e',e)}
          {...swiperConf}
        >
          {slides.length > 0 && slides.map((slide, index) => contentsFn(slide, index))}
          <SwiperNav
            swiperRef={swiperRef}
            slides={slides}
            activeIndex={activeIndex}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            rangeRef={rangeRef}
            timeRef={timeRef}
            onRangeChange={onRangeChange}
          />
        </Swiper>
      );
    },
    [slides, activeIndex, isPlaying, rangeRef, swiperRef]
  );

  /**
   * slideのコンテンツ
   * @param slide
   * @param index
   * @returns
   */
  const mainContents: ContentsFn = (slide, index) => {
    return (
      <SwiperSlide key={`slide-${index}`}>
        <div
          className={
            (swiperRef.current.activeIndex === activeIndex
              ? "active-slide"
              : "not-active-slide") + `slide-${index}`
          }
          style={{height: '85vh', overflow: 'hidden'}}
        >
          <img src={slide} style={{ width: "100%" }}></img>
        </div>
      </SwiperSlide>
    );
  };

  // swiperを使ったコンポーネント作成
  const slideSingle = createSwiperComp(
    {
      slidesPerView: 1,
    },
    mainContents
  );

  const slideMulti = createSwiperComp(
    {
      spaceBetween: 50,
      slidesPerView: 1.4,
    },
    mainContents
  );


  /**
   * 
   * @returns {void}
   */
  const setSingleMode = (): void => setViewMode(VIEW_MODE.SINGLE);

  /**
   * 
   * @returns {void}
   */
  const setMultiMode = (): void => setViewMode(VIEW_MODE.MULTI);

  // useEffect --------------------------------------------------------------------------------

  useEffect(() => {
    if (!fistRenderCancelRef) {
      return;
    } else {
      const url = "https://dog.ceo/api/breeds/image/random";
      (async () => {
        for await (const _ of new Array(5)) {
          await fetch(url)
            .then((res) => {
              res
                .json()
                .then((data) => setSlides({ type: "set", data: data.message }));
            })
            .catch((error) => console.error(error));
        }
      })();

      rangeRef.current.value = initialAutoPlaySpeed.toString(); //初期値
    }
  }, []);

  useEffect(() => {
    if (!fistRenderCancelRef) {
      slides.length > 0 && setActiveIndex(0);
    } else {
      fistRenderCancelRef.current = false;
    }
  }, [slides]);


  useEffect(() => {
    console.log(viewMode)
  }, [viewMode]);

  useEffect(() => {
    if(!swiperRef.current || !swiperRef.current.autoplay) { return; }
    if(isPlaying){
      swiperRef.current.autoplay.start();
    } else {
      swiperRef.current.autoplay.stop();
    }
  }, [isPlaying]);

  // render --------------------------------------------------------------------------------
  return (
  <>
 
    <div style={{width: '85vw', margin: '0 auto'}}>
      <div style={{width: '100%', margin: '30px auto'}}>
        <button style={{display: 'inline-block', padding: '3px 5px', margin: '0 8px'}} onClick={setSingleMode}>Single</button>
        <button style={{display: 'inline-block', padding: '3px 5px', margin: '0 8px'}} onClick={setMultiMode}>Multi</button>
      </div>
      { viewMode === VIEW_MODE.SINGLE && slideSingle && slideSingle }
      { viewMode === VIEW_MODE.MULTI && slideMulti && slideMulti }
    </div>
  </>
  );
}

export default App;
