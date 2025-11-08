import img from "figma:asset/667578da0f7ec2c3fb47782b7f7c40a996fc2467.png";

export default function Icon() {
  return (
    <div className="relative size-full" data-name="Icon">
      <div className="absolute aspect-[256/256] bottom-0 left-1/2 top-0 translate-x-[-50%]" data-name="Custom-Icon-Default 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img} />
      </div>
    </div>
  );
}