'use client';
import Heading from '@/components/Heading';
import ImageSimilaritySearch from '@/components/ImageSimilaritySearch';
import SearchBox from '@/components/SearchBox';
import { _documentSchema } from '@/types/typesenseResponse';
import { useEffect, useState } from 'react';
import axios from 'axios';

/*
 * This fetch the data from typesense server using dynamic page `slug` and pass it to `ImageSimilaritySearch` component
 * Since axios (typesense-js) does not work in edge runtime, we have to fetch data in client side
 */
export default function ExploreSimilarImagesPage({
  params,
}: {
  params: { slug: string };
}) {
  const [imageData, setImageData] = useState<_documentSchema>();

  useEffect(() => {
    (async () => setImageData(await getImageData(params.slug)))();
  }, []);

  return (
    <>
      <section className='mb-6'>
        <Heading />
      </section>
      <SearchBox />
      {imageData && <ImageSimilaritySearch imageData={imageData} />}
    </>
  );
}

async function getImageData(slug: string) {
  try {
    const { data } = await axios.post(`http://localhost:8080/api/search`, {
      q: '*',
      per_page: 1,
      vector_query: `embedding:([], id:${slug})`,
      exclude_fields: 'embedding, out_of', // reduce ~98.5% of bytes transferred over network
    });
    const res = data.results[0].hits[0];
    return res.document as _documentSchema | undefined;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}

export const runtime = 'edge';
