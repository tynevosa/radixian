import EggImg from "../../assets/egg.png";
import { PropsWithChildren } from "react";

interface EggProps extends React.HTMLAttributes<HTMLDivElement> {

}

const Egg: React.FC<PropsWithChildren<EggProps>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div {...props} className={`group cursor-pointer ${className}`}>
      <img
        src={EggImg}
        className="relative z-50 active:scale-90 transition-all duration-100"
      />
      {/* <img
        src={`/assets/egg_glow.png`}
        className="hidden group-hover:flex absolute left-0 -top-4"
      /> */}
      {children}
    </div >
  );
}

export default Egg;