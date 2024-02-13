import { useRouter } from "next/router";

interface MenuItemProps {
  label: string;
  onClick: () => void;
  pathName: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, onClick, pathName }) => {
  const router = useRouter();
  const { pathname: currentPathName } = router;

  return (
    <div
      onClick={onClick}
      className={`h-10 ${
        currentPathName === pathName
          ? "bg-blue-600 text-gray-200"
          : "hover:bg-gray-100"
      } flex items-center rounded-lg py-2 pl-2 hover:cursor-pointer`}
    >
      {label}
    </div>
  );
};

export default MenuItem;
