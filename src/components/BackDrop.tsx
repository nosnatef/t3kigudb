interface BackDropProps {
  onClick: () => void;
  isShown?: boolean;
}

const BackDrop: React.FC<BackDropProps> = ({ onClick, isShown = false }) => {
  return (
    <div
      onClick={onClick}
      className={`fixed inset-0 z-40 bg-gray-600 ${
        isShown ? "bg-opacity-50" : "pointer-events-none bg-opacity-0"
      } h-full w-full transform transition-all duration-200 ease-in-out`}
    ></div>
  );
};

export default BackDrop;
