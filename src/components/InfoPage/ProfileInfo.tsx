interface ProfileInfoProps {
  stat: string | number;
  desc: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ stat, desc }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-lg font-bold text-[#242760]">{stat}</div>
      <div className="text-xs">{desc}</div>
    </div>
  );
};

export default ProfileInfo;
