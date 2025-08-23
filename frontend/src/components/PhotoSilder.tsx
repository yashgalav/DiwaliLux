import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'
import { useRecoilState } from 'recoil';
import { quickViewAtom } from '../store/Atom';

interface slideObject {
    url: string;
}
interface SliderProps {
    Sliders: slideObject[];
}
export default function PhotoSilder({ Sliders }: SliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    console.log(Sliders);

    const [quickView, setQuickView] = useRecoilState(quickViewAtom);
        console.log(quickView)
        const clickedQuickView = () => {
            setQuickView(false)
            console.log(quickView)
        }


    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? Sliders.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex)
    }

    const nextSlide = () => {
        const isLastSlide = currentIndex === Sliders.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }
    console.log(Sliders[currentIndex].url);


    return (
        <div className='max-w-[1000px] h-[680px] w-full m-auto py-16 px-4 relative group'>
            <div
                style={{ backgroundImage: `url(${Sliders[currentIndex].url})` }}
                className='w-full h-full rounded-2xl bg-center bg-cover duration-500'
            >
            </div>

            {/* left arrow */}
            <div onClick={prevSlide} className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl  rounded-full  p-2 bg-black/20 text-white cursor-pointer'>
                <ChevronLeft size={30} />
            </div>

            {/* right arrow */}
            <div onClick={nextSlide} className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl  rounded-full  p-2 bg-black/20 text-white cursor-pointer'>
                <ChevronRight size={30} />
            </div>

            {/* cross button */}
            <div onClick={clickedQuickView} className='hidden group-hover:block absolute top-[15%] -translate-x-0 translate-y-[-50%] right-10 text-2xl  rounded-full  p-2 bg-black/20 text-white cursor-pointer'>
                <X size={30} />
            </div>
        </div>
    )
}
