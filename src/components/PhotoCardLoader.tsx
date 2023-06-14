import ContentLoader from "react-content-loader";

const PhotoCardLoader = () => {
  return (
    <ContentLoader className="w-full border shadow-sm max-h-[200px] max-w-[200px]">
      <rect x="0" y="0" rx="5" ry="5" width={"100%"} height={"100%"} />
    </ContentLoader>
  );
}
 
export default PhotoCardLoader;