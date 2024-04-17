import React,{ useEffect, useState, useCallback, useRef } from "react";

import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from 'axios';


import logger from "@config/logger";
import PageHead from "@components/PageHead";
import Page from "@components/Page";
import { PROJECT_NAME } from "@constants/index";
import Button from "@components/Button";
import Navigation from "@components/account/manage/Navigation";
import Alert from "@components/Alert";
import Badge from "@components/Badge";
import Input from "@components/form/Input";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const username = session.username;

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

export default function addRelease({ profile, progress }) 
{

  const router = useRouter();
  const { replace, query, pathname } = useRouter();
  const [formData, setFormData] = useState({
    searchInput: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      [name]: value
    }));
  };
  const { data: session } = useSession();
  const { username, keyword, userSearchParam } = query;

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

  const searchInputRef = useRef(null);
  const searchTerm = username || keyword || userSearchParam;

  const alerts = {
    premium: "You are now a premium user!",
    cancel: "You cancelled your subscription.",
  };
  const handleSearchSubmit = async (e,searchWord) => {
    e.preventDefault();
    try {
      const response = await axios.get('/api/release/scan?query='+searchWord);
      try{
        const jsonData = JSON.parse(JSON.stringify(response.data));

        const title = jsonData.result.result.title;
        if(title)
        {
          router.push("http://localhost:3000/Release/create?query="+searchWord);
        }else{
          alert("no release found");
        }
      }catch(ec){
        alert("no release found");
      }
     
      /*const searchdbResponse = await axios.get(`/api/release/searchdb?query=${encodeURIComponent(title)}`);
      const user = JSON.parse(JSON.stringify(searchdbResponse.data));

      
      router.push({pathname: '/'+searchdbResponse, });*/
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  };
  return (
    <>
      <PageHead
        title="Onboarding Dashboard"
        description={`Here you can manage your ${PROJECT_NAME} profile`}
      />

      <Page>
        <Navigation />

        {router.query.alert && (
          <Alert type="info" message={alerts[router.query.alert]} />
        )}

        <div className="flex flex-col mb-8 md:flex-row">
          <h1 className="mb-4 text-4xl font-bold grow">
            Create &amp; Your Releases
          </h1>
          
        </div>

        <Badge
          
          className="w-full"
          badgeClassName={"translate-x-2/4 -translate-y-1/2"}
        >
          <form onSubmit={(e) => handleSearchSubmit(e, formData.searchInput)} className="w-full">
            <Input
              ref={searchInputRef}
              id="searchInput"
              name="searchInput"
              value={formData.searchInput}
              onChange={handleChange}
              placeholder="Search release by spotifyLink , ISRC or UPC"
              defaultValue={searchTerm}
            />
            <Button type="submit" className="mb-4">
              Search
            </Button>
          </form>
        </Badge>
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {}
        </ul>
      </Page>
    </>
  );
}
