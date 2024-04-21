import { authOptions } from "/pages/api/auth/[...nextauth]";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import Button from "@components/Button";
import Alert from "@components/Alert";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import logger from "@config/logger";
import PageHead from "@components/PageHead";
import Page from "@components/Page";
import { getUserApi } from "pages/api/profiles/[username]";
import { PROJECT_NAME } from "@constants/index";


export async function getServerSideProps(context) {
 

  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  const username = session.username;
  logger.info('vvvvvvvvvvvvvvvvvvvvvvvv');
  let profile = {};
  try {
    profile = (await getUserApi(context.req, context.res, username)).profile;
  } catch (e) {
    logger.error(e, `profile loading failed for username: ${username}`);
  }
  if (profile.error) {
    profile.username = session.username;
    profile.name = session.user.name;
  }

  let profileSections = [
    "links",
    "milestones",
    "tags",
    "socials",
    "testimonials",
    "events",
    "repos",
  ];
  let progress = {
    percentage: 0,
    missing: [],
  };

  progress.missing = profileSections.filter(
    (property) => !profile[property]?.length,
  );
  progress.percentage = (
    ((profileSections.length - progress.missing.length) /
      profileSections.length) *
    100
  ).toFixed(0);

  return {
    props: { profile, progress },
  };
}

export default function Onboarding({ profile, progress }) {
  const [releases, setReleases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/release/get?query=${currentPage}`);
        console.error(currentPage);
        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          setReleases(prevReleases => [...prevReleases, ...response.data]);
          setCurrentPage(prevPage => prevPage + 1);
        }
      } catch (error) {
        console.error("Error fetching releases:", error);
      } finally {
        setLoading(false);
      }
    };

    if (hasMore && loader.current) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          fetchReleases();
        }
      }, { threshold: 1 });

      observer.observe(loader.current);

      return () => {
        if (observer) {
          observer.disconnect();
        }
      };
    }
  }, [currentPage, hasMore]);

  if (typeof window !== "undefined" && window.localStorage) {
    if (router.query.alert) {
      localStorage.removeItem("premium-intent");
    }
    if (
      session &&
      session.accountType !== "premium" &&
      localStorage.getItem("premium-intent")
    ) {
      localStorage.removeItem("premium-intent");
      router.push("/api/stripe");
    }
  }

  const cards = [
    {
      title: "Profile",
      description: "Start and Edit your Profile",
      button: {
        name: "Profile",
        href: "/account/manage/profile",
      },
      isEdit: profile.bio,
    },
  ];

  const alerts = {
    premium: "You are now a premium user!",
    cancel: "You cancelled your subscription.",
  };
  
  return (
    <>
      <PageHead
        title="Onboarding Dashboard"
        description={`Here you can manage your ${PROJECT_NAME} profile`}
      />

      <Page>
        {router.query.alert && (
          <Alert type="info" message={alerts[router.query.alert]} />
        )}

        <div className="flex flex-col mb-8 md:flex-row">
          <h1 className="mb-4 text-4xl font-bold grow">
            Create &amp; Manage Your Releases
          </h1>
          <Button
            href={`/Release/add`}
            className={"gap-4"}
            disabled={!cards[0].isEdit}
          >
            <FaArrowUpRightFromSquare className="w-4 h-4" /> Create Short Link
          </Button>
        </div>

        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {releases.map((release, index) => (
            <li key={release.id || index} className="card" >
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
        <div ref={loader} />
      </Page>
    </>
  );
}
