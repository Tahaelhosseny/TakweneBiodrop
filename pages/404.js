import Image from "next/image";

import Page from "@components/Page";
import BlankLayout from '../components/layouts/BlankLayout'; // Adjust the path as needed

export default function Page404() {
  return (
    <>
      <Page>
        <div className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary-high dark:text-primary-low sm:text-5xl">
              Release not found
            </h1>
            <p className="m-6 text-base leading-7 text-primary-high dark:text-primary-low">
              Sorry, we could not find the release you are looking for.
            </p>
            <Image
              className="mx-auto"
              src="https://user-images.githubusercontent.com/624760/114314273-eaae0100-9af1-11eb-955a-4039657fe85a.png"
              alt="EddieHub mascot scared pose"
              width={300}
              height={300}
            />
           
          </div>
        </div>
      </Page>
    </>
  );
}

Page404.getLayout = function getLayout(page) {
  return <BlankLayout>{page}</BlankLayout>;
};
