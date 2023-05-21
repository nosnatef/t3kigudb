import { useRouter } from 'next/router';

interface MenuItemProps {
  label: String;
  onClick: () => void;
  pathName: String;
}

const MenuItem: React.FC<MenuItemProps> = ({
  label,
  onClick,
  pathName
}) => {
  const router = useRouter();
  const { pathname: currentPathName } = router;

  return ( 
    <div onClick={onClick} className={`h-10 ${currentPathName === pathName ? "bg-blue-600 text-gray-200" : "hover:bg-gray-100"} hover:cursor-pointer rounded-lg pl-2 py-2 flex items-center`}>
      {label}
    </div>
  );
}
 
export default MenuItem;