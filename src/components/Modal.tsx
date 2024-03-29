import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from './icons';

const SAMPLER = {
  1: 'ddim',
  2: 'plms',
  3: 'k_euler',
  4: 'k_euler_ancestral',
  5: 'k_heun',
  6: 'k_dpm_2',
  7: 'k_dpm_2_ancestral',
  8: 'k_lms',
  9: 'others',
};

export default function Modal({ data, handleClose }: any) {
  return (
    <section className='fixed inset-0 grid place-items-center'>
      <div className='bg-dark-900 relative z-10 flex h-[90vh] w-[80vw] gap-10 rounded-xl'>
        <div className='bg-dark-950 relative flex h-full w-[70%] rounded-xl p-4'>
          <Image
            className='flex-1 object-contain'
            src={`/part-1-2-2m/${data.id}`}
            width={0}
            height={0}
            sizes='80vw'
            alt={data.prompt}
          />
        </div>
        <div className='[&_span]:text-white-300 flex flex-1 flex-col gap-8 py-8 pr-5 [&_p]:font-mono [&_p]:text-sm [&_span]:mb-2 [&_span]:block [&_span]:text-xs [&_span]:font-bold'>
          <div>
            <span>PROMPT</span>
            <p>{data.prompt}</p>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <div>
              <span>SEED</span>
              <p>{data.seed}</p>
            </div>
            <div>
              <span>CFG SCALE</span>
              <p>{data.cfg}</p>
            </div>
            <div>
              <span>STEPS</span>
              <p>{data.step}</p>
            </div>
            <div>
              <span>SAMPLER</span>
              <p>{SAMPLER[data.sampler]}</p>
            </div>
          </div>
          <Link
            href={`/${data.id}`}
            className='text-accent bg-accent border-accent flex w-max items-center rounded-lg border-[1px] border-opacity-50 bg-opacity-25 px-3 py-[.35rem] text-sm'
          >
            Explore similar style <ChevronRight className='ml-1' />
          </Link>
        </div>
      </div>
      <div
        className='fixed inset-0 z-0 bg-slate-950 opacity-70'
        onClick={handleClose}
      ></div>
    </section>
  );
}
