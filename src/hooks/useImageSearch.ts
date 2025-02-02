import { typesense } from '@/lib/typesense';
import { _hit } from '@/types/typesenseResponse';
import { useEffect, useRef, useState } from 'react';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import axios from 'axios';

/*
 * Search logic for <ImageSearch/>
 */
export default function useImageSearch(searchParameters: SearchParams) {
  const page = useRef(0);
  const [hits, setHits] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isNoResults, setIsNoResults] = useState(false);

  useEffect(() => {
    fetchNextPage();
  }, []);

  const fetchNextPage = async () => {
    setIsLoading(true);
    page.current++;
    try {
      const { data } = await axios.post(`http://localhost:8080/api/search`, {
        ...searchParameters,
        page: page.current,
      });
      const res = data.results[0];
      const isNoHitsReturned = res.hits?.length ? false : true;
      setIsLastPage(isNoHitsReturned);
      setHits((prev: _hit[]) => {
        setIsNoResults(isNoHitsReturned && prev.length === 0 ? true : false);
        return [...prev, ...(res.hits || [])];
      });
    } catch (error) {
      alert('Sorry, there is an error fetching data!');
    } finally {
      setIsLoading(false);
    }
  };

  return { hits, fetchNextPage, isLoading, isLastPage, isNoResults };
}
