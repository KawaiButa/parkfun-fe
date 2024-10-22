import { Suspense } from "react";

import LoginForm from "@/components/loginForm/loginForm";

const page = () => {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
};

export default page;
