import { useEffect, useRef } from 'react';

const useRefreshAction = (onPageRefresh: () => void) => {
    const onPageRefreshRef = useRef(false);

    useEffect(() => {
      const handlePageRefresh = () => {
        if (!onPageRefreshRef.current) {
          onPageRefreshRef.current = true;
          onPageRefresh();
        }
      };
  
      window.addEventListener('beforeunload', handlePageRefresh);
  
      return () => {
        window.removeEventListener('beforeunload', handlePageRefresh);
      };
    }, [onPageRefresh]);
  };
  
export default useRefreshAction;