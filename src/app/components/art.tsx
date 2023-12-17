'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import ColorThief from 'colorthief';
import {
  useInterval,
  usePrevious,
  usePreviousDistinct,
  useWindowSize,
} from 'react-use';
import { spotify } from '../api/spotify/client';
import { motion, AnimatePresence } from 'framer-motion';
import { RxTrackNext, RxTrackPrevious, RxPause } from 'react-icons/rx';
import { Track, Episode } from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import { ImHeart } from 'react-icons/im';
import { PiPlayPauseFill } from 'react-icons/pi';
import cx from 'classnames';

type Palette = [number, number, number][];

const convertToRgbString = (paletteItem: Palette[number]) => {
  return `rgba(${paletteItem.join(',')})`;
};

export const Art = () => {
  const [imageElement, setImageElement] = useState<
    HTMLImageElement | undefined
  >();
  const [image, setImage] = useState<string | StaticImageData>('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const colorThief = useMemo(() => new ColorThief(), []);
  const [palette, setPalette] = useState<Palette | undefined>();
  const [primaryColor, setPrimaryColor] = useState('rgba(255,255,255)');
  const [secondaryColor, setSecondaryColor] = useState('rgba(255,255,255)');
  const [artistNames, setArtistNames] = useState<string[]>([]);
  const [trackName, setTrackName] = useState<string>('');
  const isLoaded = useRef(false);
  const [queue, setQueue] = useState<(Track | Episode)[]>([]);
  const [isInactive, setIsInactive] = useState(true);

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', primaryColor);

    document.documentElement.style.setProperty(
      '--color-secondary',
      secondaryColor
    );

    return () => {
      document.documentElement.style.setProperty(
        '--color-primary',
        `rgba(0,0,0,1)`
      );

      document.documentElement.style.setProperty(
        '--color-secondary',
        `rgb(205, 184, 186)` // temp
      );
    };
  }, [colorThief, imageElement, primaryColor, secondaryColor]);

  const { push } = useRouter();

  const { width } = useWindowSize();
  const isMobile = width <= 660;

  const fetchAndSetupSpotifyData = async () => {
    try {
      const { currently_playing, queue } = await spotify().queue();

      if (currently_playing) {
        setIsInactive(false);
        setArtistNames(
          (currently_playing as any).artists.map((artist: any) => artist.name)
        );
        setTrackName(currently_playing.name as string);
        if ((currently_playing as any).album?.images?.length) {
          setImage((currently_playing as any).album?.images[0].url);
        }
      } else {
        setIsInactive(true);
      }

      setQueue(queue);
    } catch (error) {
      push('/api/spotify/login');
    }
  };

  const previousImage = usePrevious(image);
  useEffect(() => {
    if (previousImage !== image) {
      setIsImageLoaded(false);
      setTimeout(() => setIsImageLoaded(true), 500);
    }
  }, [image, previousImage]);

  useEffect(() => {
    if (isLoaded.current === false) {
      isLoaded.current = true;
      fetchAndSetupSpotifyData();
    }
  });

  const previousIsInactive = usePrevious(isInactive);
  useEffect(() => {
    if (previousIsInactive !== isInactive && isInactive) {
      setPrimaryColor(`rgba(0,0,0)`);
      setSecondaryColor(`rgba(0,0,0)`);
    }
  }, [isInactive, previousIsInactive]);

  useInterval(async () => {
    await fetchAndSetupSpotifyData();
  }, 5000);

  if (isInactive) {
    return null;
  }

  return (
    <div className="flex w-full items-center flex-wrap">
      <AnimatePresence>
        {palette && isImageLoaded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: {
                duration: 0.2,
              },
            }}
          >
            <button
              className="active:opacity-50 transition-all active:scale-125 -ml-12 px-6"
              onClick={async () => {
                await spotify().previous();
                await fetchAndSetupSpotifyData();
              }}
            >
              <RxTrackPrevious
                color={convertToRgbString(palette[2])}
                size={isMobile ? 25 : 50}
              />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <figure
        className={cx('z-30 relative', {
          ['w-[15vw]']: isMobile,
          ['w-[35vw]']: !isMobile,
        })}
      >
        <AnimatePresence>
          {image && isImageLoaded ? (
            <motion.div
              initial={{ rotateZ: 25, x: -1000, opacity: 0.5 }}
              animate={{ rotateZ: 0, x: 0, opacity: 1 }}
              exit={{ scale: 0.9, rotateZ: -25, x: -1000, opacity: 0 }}
              transition={{
                opacity: {
                  duration: 3,
                },
                x: {
                  type: 'spring',
                  mass: 5.7,
                  damping: 39,
                  stiffness: 298,
                },
              }}
            >
              <Image
                onLoad={(img) => {
                  if (img?.currentTarget?.getAttribute('src')) {
                    setImageElement(img.currentTarget);
                    const palette = colorThief?.getPalette(img.currentTarget);
                    setPalette(palette);
                    const primaryColor = convertToRgbString(palette[0]);
                    setPrimaryColor(primaryColor);
                    const secondaryColor = convertToRgbString(palette[1]);
                    setSecondaryColor(secondaryColor);
                    setIsImageLoaded(true);
                  }
                }}
                priority
                alt={`art for ${trackName}`}
                src={image}
                width={500}
                height={500}
                className="w-full shadow-lg"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </figure>
      <div className="pl-12 flex-1 flex items-center">
        <div>
          <AnimatePresence>
            {isImageLoaded ? (
              <motion.div
                initial={{ x: 1000, opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 1000, opacity: 0.5 }}
                transition={{
                  opacity: {
                    duration: 3,
                  },
                  x: {
                    type: 'spring',
                    mass: 5.7,
                    damping: 39,
                    stiffness: 400,
                  },
                }}
              >
                <h2
                  className={`transition-all w-full mb-[1vh] leading-[5.2vw] text-[5vw] font-semibold [text-shadow:_5px_5px_0px_rgb(0_0_0_/_45%)] flex items-center`}
                >
                  {trackName}
                </h2>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <AnimatePresence>
            {isImageLoaded ? (
              <motion.div
                initial={{ x: 1000, opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 1000, opacity: 0.5 }}
                transition={{
                  opacity: {
                    duration: 3,
                  },
                  x: {
                    type: 'spring',
                    mass: 5.7,
                    damping: 39,
                    stiffness: 400,
                  },
                }}
              >
                <p
                  className={`transition-all m-0 leading-[2.2vw] text-[2.5vw] opacity-75`}
                  style={{
                    color: secondaryColor,
                  }}
                >
                  {artistNames.join(', ')}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="px-6 flex items-center opacity-50 space-x-4">
          <ImHeart
            style={{
              color: secondaryColor,
            }}
            size={isMobile ? 12 : 25}
          />
          <button
            className="active:opacity-75 transition-all active:scale-125"
            onClick={async () => {
              const isPlaying = await spotify().isPlaying();
              if (isPlaying) {
                await spotify().pause();
              } else {
                await spotify().resume();
              }
            }}
          >
            <PiPlayPauseFill
              style={{
                color: secondaryColor,
              }}
              size={isMobile ? 20 : 40}
            />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {palette && isImageLoaded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: {
                duration: 0.2,
              },
            }}
          >
            <button
              className="active:opacity-50 transition-all active:scale-125"
              onClick={async () => {
                await spotify().next();
                await fetchAndSetupSpotifyData();
              }}
            >
              <RxTrackNext
                color={convertToRgbString(palette[2])}
                size={isMobile ? 25 : 50}
              />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="w-full flex mt-8">
        <AnimatePresence>
          {queue.slice(0, isMobile ? 2 : 3).map((item, idx) => {
            return <QueueItem key={item.id} index={idx} {...item} />;
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface QueueItemPropsTrack extends Track {
  index: number;
}
interface QueueItemPropsEpisode extends Episode {
  index: number;
}

const QueueItem = (props: QueueItemPropsTrack | QueueItemPropsEpisode) => {
  const { name, index } = props;

  const image = (props as any)?.album?.images[0].url;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const previousImage = usePrevious(image);
  useEffect(() => {
    if (previousImage !== image) {
      setIsImageLoaded(false);
      setTimeout(() => setIsImageLoaded(true), 1000);
    }
  }, [image, previousImage]);
  const { width } = useWindowSize();
  const isMobile = width <= 660;

  return (
    <motion.button
      onClick={async () => {
        await spotify().skipAhead(index + 1);
      }}
      key={props.name}
      className="flex justify-center w-full transition-all opacity-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.5, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{
        opacity: {
          duration: 0.5,
        },
      }}
    >
      <div className="flex">
        <div className="flex items-center">
          <AnimatePresence>
            {isImageLoaded ? (
              <motion.figure
                className={cx('[box-shadow:_2px_2px_0px_rgb(0_0_0_/_25%)]', {
                  ['w-[50px] h-[50px]']: isMobile,
                  ['w-[100px] h-[100px]']: !isMobile,
                })}
              >
                <Image
                  onLoad={(img) => {
                    if (img?.currentTarget?.getAttribute('src')) {
                      setIsImageLoaded(true);
                    }
                  }}
                  alt={`art for ${name}`}
                  src={image}
                  width={isMobile ? 50 : 100}
                  height={isMobile ? 50 : 100}
                  //   className="w-[100px] h-[100px]"
                />
              </motion.figure>
            ) : null}
          </AnimatePresence>
          <div className="px-4 flex-1">
            <h3
              className={`transition-all w-full mb-[1vh] leading-[2vw] text-[1.8vw] font-semibold [text-shadow:_2px_2px_0px_rgb(0_0_0_/_30%)] text-left`}
            >
              {name}
            </h3>
            <p
              className={`transition-all m-0 leading-[1.2vw] text-[1.2vw] opacity-75 text-left`}
            >
              {(props as any).artists
                .slice(0, 2)
                .map((a: any) => a.name)
                .join(',')}
            </p>
          </div>
        </div>
      </div>
    </motion.button>
  );
};
