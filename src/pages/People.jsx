import { useState, useEffect, useCallback } from 'react';
import { getTrendingPeople } from '../services/moviesService';
import PersonCard from '../components/PersonCard';
import Loader from '../components/Loader';

const People = () => {
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadPeople = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const results = await getTrendingPeople(page);
      // getTrendingPeople already returns response.data.results as per controller fix
      const data = results.data; 
      
      if (data && data.length > 0) {
        setPeople((prev) => {
          const newPeople = data.filter(p => !prev.some(existing => existing.id === p.id));
          return [...prev, ...newPeople];
        });
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load people:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadPeople();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle scroll for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 500 && !loading && hasMore) {
        loadPeople();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadPeople]);

  return (
    <div className="min-h-screen py-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <h1
            className="text-4xl font-bold tracking-wider uppercase"
            style={{ color: 'var(--text-primary)' }}
          >
            People
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Discover the stars behind your favorite films and shows
          </p>
        </div>

        {people.length === 0 && !loading ? (
          <div
            className="flex flex-col items-center justify-center py-24 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>
              No people found at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {people.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>

            {loading && (
              <div className="flex justify-center mt-12">
                <Loader />
              </div>
            )}
            
            {!hasMore && people.length > 0 && (
              <p className="text-center mt-12 text-sm" style={{ color: 'var(--text-secondary)' }}>
                You've seen them all!
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default People;

