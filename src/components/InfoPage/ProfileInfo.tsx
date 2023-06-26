interface ProfileInfoProps {
  stat: string | number,
  desc: string
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  stat,
  desc
}) => {
  return ( 
  <div className="flex justify-center flex-col items-center">
    <div className="text-[#242760] font-bold text-lg">
      {stat}
    </div>
    <div className="text-xs">
      {desc}
    </div>
</div> );
}
 
export default ProfileInfo;