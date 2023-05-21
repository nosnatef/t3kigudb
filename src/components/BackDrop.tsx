interface BackDropProps {
  onClick: () => void,
  isShown?: Boolean
}

const BackDrop: React.FC<BackDropProps> = ({
  onClick,
  isShown = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`z-40 fixed inset-0 bg-gray-600 ${isShown ? "bg-opacity-50" : "pointer-events-none bg-opacity-0"} h-full w-full transform ease-in-out transition-all duration-200`} >
    </div>
  )
}
 
export default BackDrop;