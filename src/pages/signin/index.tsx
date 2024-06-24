import { useRouter } from "next/router";
import { useEffect } from "react";

const ProtectedPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, []);

  return <div>This is a protected page</div>;
};

export default ProtectedPage;
