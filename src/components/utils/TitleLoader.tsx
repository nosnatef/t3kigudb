import ContentLoader from "react-content-loader"

const TitleLoader = () => {
  return (
    <ContentLoader 
      speed={2}
      width={100}
      height={60}
    >
      <rect x="58" y="18" rx="2" ry="2" width="267" height="27" />
    </ContentLoader>
  )
}

export default TitleLoader;