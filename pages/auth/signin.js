import { getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";

import BlankLayout from "@components/layouts/BlankLayout";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { BsGithub, BsGoogle } from "react-icons/bs";
import Button from "@components/Button";
import Link from "@components/Link";
import Logo from "@public/logos/Logo";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  return {
    props: {},
  };
}

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-8 min-w-max">
          <img
              src="http://localhost:3000/logos/tak_logo_black.png"
              alt="BioDrop Home"
              width={360}
              />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-primary-medium flex flex-col">
          <span>Connect to YOUR audience</span>
          <span className="text-tertiary-medium">with a single link</span>
        </h2>

        <Button primary={true} key="google" onClick={() => signIn("google")}>
          <span className="mr-2">
            <BsGoogle className="text-2xl" />
          </span>
          Continue with Google
        </Button>

        <p className="mt-10 text-center text-sm text-primary-low-medium">
          Don&lsquo;t have a Google account? Create one on{" "}
          <Link href="https://accounts.google.com/v3/signin/identifier?continue=http%3A%2F%2Fsupport.google.com%2Faccounts%2Fanswer%2F27441%3Fhl%3Den&ec=GAZAdQ&hl=en&ifkv=ARZ0qKKfREjGl08TEGlMMgJtA7uIezUv_H3ZyHy-9xwsQLeGYIkHu5UrBPzWN0KSLfDSbxaQXhfqHw&passive=true&sjid=13958094034036690395-EU&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S1224809929%3A1713576377736446&theme=mn&ddm=0" target="_blank">
            Google
          </Link>
        </p>
      </div>
    </div>
  );
}

SignIn.getLayout = function getLayout(page) {
  return <BlankLayout>{page}</BlankLayout>;
};