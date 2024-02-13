import ContentLoader from "react-content-loader";

const PhotoCardLoader = () => {
  return (
    <ContentLoader className="max-h-[200px] w-full max-w-[200px] border shadow-sm">
      <rect x="0" y="0" rx="5" ry="5" width={"100%"} height={"100%"} />
    </ContentLoader>
  );
};

export default PhotoCardLoader;
