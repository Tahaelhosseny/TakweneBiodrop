import { useState, useRef, useEffect } from "react";
import Page from "@components/Page";
import PageHead from "@components/PageHead";
import Badge from "@components/Badge";
import Input from "@components/form/Input";
import { PROJECT_NAME } from "@constants/index";
import Button from "@components/Button";
import axios from 'axios';


export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [releases, setReleases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const searchInputRef = useRef(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMoreReleases();
      }
    }, { threshold: 1 });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading]);

  const loadMoreReleases = async () => {
    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const response = await axios.get(`/api/release/searchReleases?page=${nextPage}&query=${searchTerm}`);
      setReleases(prevReleases => [...prevReleases, ...response.data]);
      setCurrentPage(nextPage);
      console.error(nextPage);
      setHasMore(response.data.length > 0);
    } catch (error) {
      console.error("Error loading more releases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm) {
      try {
        const response = await axios.get(`/api/release/searchReleases?page=1&query=${searchTerm}`);
        setReleases(response.data);
        setCurrentPage(1);
        setHasMore(response.data.length > 0);
      } catch (error) {
        console.error("Error searching releases:", error);
        setReleases([]);
      }
    } else {
      alert("Search term is empty");
    }
  };

  return (
    <>
      <PageHead
        title={`${PROJECT_NAME} Search Users`}
        description={`Search links by title, SubLink , UPC, ISRC`}
      />
      <Page>
        <h1 className="mb-4 text-4xl font-bold">Search</h1>
        <Badge
          className="w-full"
          badgeClassName={"translate-x-2/4 -translate-y-1/2"}
        >
          <form onSubmit={handleSearchSubmit} className="w-full">
            <Input
              ref={searchInputRef}
              placeholder="Search links by title, SubLink , UPC, ISRC"
              name="keyword"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" className="mb-4">
              Search
            </Button>
          </form>
        </Badge>
        {!searchTerm && (
          <h2 className="mt-10 mb-4 text-2xl font-bold">
            Recently updated profiles
          </h2>
        )}

        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {releases.map((release) => (
            <li key={release.id} className="card" >
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <img src={release.artWorkUrl} alt={release.title} className="release-image" style={{ width: 'auto', height: '150px', aspectRatio: '1/1', objectFit: 'contain' }}/>
              </div>
              <h6>{release.title}</h6>
              
              <Button href={`/Release/statistics?releaseId=${release._id}`} className="open-button">Open</Button>
            </li>
          ))}
        </ul>
        
        {loading && <p>Loading...</p>}
        {!hasMore && <p>No more releases to load.</p>}
        <div ref={loaderRef}></div>
      </Page>
    </>
  );
}
